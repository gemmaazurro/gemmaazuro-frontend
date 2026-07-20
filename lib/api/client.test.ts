import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError, apiFetch, apiFetchPaginated, fetchAllPages } from './client';

const BACKEND = 'http://localhost:8000';

function mockFetch(handler: (url: string, init: RequestInit) => Response | Promise<Response>) {
  const spy = vi.fn(async (input: RequestInfo | URL, init: RequestInit = {}) =>
    handler(String(input), init),
  );
  vi.stubGlobal('fetch', spy);
  return spy;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

beforeEach(() => {
  vi.stubEnv('NEXT_PUBLIC_BACKEND_API_URL', BACKEND);
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('auth header', () => {
  // The cache-safety invariant. If this regresses, cached catalog responses can
  // carry one user's wishlist state to every other user.
  it('does NOT send Authorization when no token is passed', async () => {
    const spy = mockFetch(() => json({ ok: true }));
    await apiFetch('/products/prouduct/items/');

    const headers = (spy.mock.calls[0]![1] ?? {}).headers as Record<string, string>;
    expect(headers.Authorization).toBeUndefined();
    expect('Authorization' in headers).toBe(false);
  });

  it('does NOT send Authorization when token is null or empty', async () => {
    const spy = mockFetch(() => json({ ok: true }));
    await apiFetch('/x/', { token: null });
    await apiFetch('/x/', { token: '' });

    for (const call of spy.mock.calls) {
      expect(((call[1] ?? {}).headers as Record<string, string>).Authorization).toBeUndefined();
    }
  });

  it('sends Bearer token when explicitly provided', async () => {
    const spy = mockFetch(() => json({ ok: true }));
    await apiFetch('/x/', { token: 'abc123' });

    const headers = (spy.mock.calls[0]![1] ?? {}).headers as Record<string, string>;
    expect(headers.Authorization).toBe('Bearer abc123');
  });
});

describe('content type', () => {
  it('sets application/json for a JSON body', async () => {
    const spy = mockFetch(() => json({}));
    await apiFetch('/x/', { method: 'POST', body: { a: 1 } });

    const init = spy.mock.calls[0]![1]!;
    expect((init.headers as Record<string, string>)['Content-Type']).toBe('application/json');
    expect(init.body).toBe('{"a":1}');
  });

  // Overriding this breaks the multipart boundary and Django parses nothing.
  it('omits Content-Type for FormData', async () => {
    const spy = mockFetch(() => json({}));
    const fd = new FormData();
    fd.append('image', 'x');
    await apiFetch('/x/', { method: 'POST', formData: fd });

    const init = spy.mock.calls[0]![1]!;
    expect((init.headers as Record<string, string>)['Content-Type']).toBeUndefined();
    expect(init.body).toBe(fd);
  });
});

describe('query params', () => {
  it('serializes params and drops empty ones', async () => {
    const spy = mockFetch(() => json({}));
    await apiFetch('/items/', {
      searchParams: { subgroup: 3, search: '', page: 2, missing: undefined, flag: false },
    });

    const url = new URL(spy.mock.calls[0]![0] as string);
    expect(url.searchParams.get('subgroup')).toBe('3');
    expect(url.searchParams.get('page')).toBe('2');
    expect(url.searchParams.get('flag')).toBe('false');
    expect(url.searchParams.has('search')).toBe(false);
    expect(url.searchParams.has('missing')).toBe(false);
  });

  it('repeats the key for array values', async () => {
    const spy = mockFetch(() => json({}));
    await apiFetch('/items/', { searchParams: { color: [1, 2] } });

    const url = new URL(spy.mock.calls[0]![0] as string);
    expect(url.searchParams.getAll('color')).toEqual(['1', '2']);
  });
});

describe('error normalization', () => {
  it('normalizes { detail }', async () => {
    mockFetch(() => json({ detail: 'Not found.' }, 404));
    await expect(apiFetch('/x/')).rejects.toMatchObject({
      name: 'ApiRequestError',
      status: 404,
      message: 'Not found.',
    });
  });

  it('normalizes { error } used by the login view', async () => {
    mockFetch(() => json({ error: 'Invalid credentials' }, 400));
    await expect(apiFetch('/x/')).rejects.toMatchObject({
      status: 400,
      message: 'Invalid credentials',
    });
  });

  it('normalizes DRF field errors and preserves them', async () => {
    mockFetch(() => json({ phone: ['This field is required.'], name: ['Too short.'] }, 400));

    const error = (await apiFetch('/x/').catch((e) => e)) as ApiRequestError;
    expect(error).toBeInstanceOf(ApiRequestError);
    expect(error.status).toBe(400);
    expect(error.fieldErrors).toEqual({
      phone: ['This field is required.'],
      name: ['Too short.'],
    });
  });

  it('handles a non-JSON error body without throwing a parse error', async () => {
    mockFetch(() => new Response('<html>500</html>', { status: 500 }));
    await expect(apiFetch('/x/')).rejects.toMatchObject({ status: 500 });
  });

  it('returns undefined for 204 rather than failing to parse', async () => {
    mockFetch(() => new Response(null, { status: 204 }));
    await expect(apiFetch('/x/', { method: 'DELETE' })).resolves.toBeUndefined();
  });
});

describe('pagination', () => {
  it('passes the DRF envelope through', async () => {
    mockFetch(() => json({ count: 2, next: null, previous: null, results: [{ id: 1 }, { id: 2 }] }));
    const page = await apiFetchPaginated<{ id: number }>('/items/');

    expect(page.count).toBe(2);
    expect(page.results).toHaveLength(2);
  });

  it('wraps a bare array — several CMS endpoints return one', async () => {
    mockFetch(() => json([{ id: 1 }, { id: 2 }, { id: 3 }]));
    const page = await apiFetchPaginated<{ id: number }>('/pages/api/faq/');

    expect(page.count).toBe(3);
    expect(page.next).toBeNull();
    expect(page.results).toHaveLength(3);
  });

  it('follows next until exhausted', async () => {
    let call = 0;
    mockFetch(() => {
      call += 1;
      return json(
        call === 1
          ? { count: 4, next: 'http://x/?page=2', previous: null, results: [{ id: 1 }, { id: 2 }] }
          : { count: 4, next: null, previous: null, results: [{ id: 3 }, { id: 4 }] },
      );
    });

    const all = await fetchAllPages<{ id: number }>('/items/');
    expect(all.map((i) => i.id)).toEqual([1, 2, 3, 4]);
  });
});
