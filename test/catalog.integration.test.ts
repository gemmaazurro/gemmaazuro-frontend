// Integration: the real client + adapter stack against recorded Django payloads.
//
// `lib/products-cache.ts` cannot be imported here — `use cache` needs the Next
// build pipeline. These exercise the layers underneath it, which is where the
// contract mismatches actually live.

import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { server, requestLog } from './server';
import { apiFetch, apiFetchPaginated } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { adaptItem, adaptItems } from '@/lib/api/adapters';
import type { DjangoItem } from '@/lib/api/types';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  server.resetHandlers();
  requestLog.length = 0;
});
afterAll(() => server.close());

beforeEach(() => {
  vi.stubEnv('NEXT_PUBLIC_BACKEND_API_URL', 'http://localhost:8000');
  vi.stubEnv('NEXT_PUBLIC_IMGPROXY_URL', '');
});

describe('catalog list', () => {
  it('unwraps the envelope and adapts to storefront products', async () => {
    const page = await apiFetchPaginated<DjangoItem>(ENDPOINTS.ITEMS);
    const products = adaptItems(page);

    expect(page.count).toBe(2);
    expect(products).toHaveLength(2);
    expect(products[0].name).toBe('Solitaire Lab Diamond Ring');
  });

  /**
   * Consequence of the missing `subgroups_`: list responses carry subgroup IDs
   * but no names, so `cat` is empty in grids. Any UI that shows a category
   * label must resolve it from getSubGroups() by ID rather than reading
   * product.cat. Detail responses do have the name.
   */
  it('yields subgroup IDs but no category name from the list endpoint', async () => {
    const page = await apiFetchPaginated<DjangoItem>(ENDPOINTS.ITEMS);
    const [solitaire] = adaptItems(page);

    expect(solitaire.subgroupIds).toEqual([1]);
    expect(solitaire.cat).toBe('');
  });

  it('yields the category name from the detail endpoint', async () => {
    const item = await apiFetch<DjangoItem>(ENDPOINTS.ITEM(1));
    expect(adaptItem(item).cat).toBe('Rings');
  });

  it('resolves the sale price from the display/original inversion', async () => {
    const page = await apiFetchPaginated<DjangoItem>(ENDPOINTS.ITEMS);
    const [solitaire] = adaptItems(page);

    expect(solitaire.price).toBe(48000);
    expect(solitaire.salePrice).toBe(43200);
  });

  it('marks a zero-qty product as out of stock with no sale price', async () => {
    const page = await apiFetchPaginated<DjangoItem>(ENDPOINTS.ITEMS);
    const pendant = adaptItems(page).find((product) => product.id === '2')!;

    expect(pendant.inStock).toBe(false);
    expect(pendant.salePrice).toBeUndefined();
    expect(pendant.price).toBe(27500);
  });

  it('pushes filtering to the API instead of filtering locally', async () => {
    const page = await apiFetchPaginated<DjangoItem>(ENDPOINTS.ITEMS, {
      searchParams: { subgroup: 2 },
    });

    expect(page.count).toBe(1);
    expect(new URL(requestLog[0].url).searchParams.get('subgroup')).toBe('2');
  });

  it('passes search through to the backend', async () => {
    const page = await apiFetchPaginated<DjangoItem>(ENDPOINTS.ITEMS, {
      searchParams: { search: 'pendant' },
    });

    expect(page.results).toHaveLength(1);
    expect(page.results[0].id).toBe(2);
  });
});

describe('catalog detail', () => {
  it('adapts a single item with its own gallery', async () => {
    const item = await apiFetch<DjangoItem>(ENDPOINTS.ITEM(1));
    const product = adaptItem(item);

    expect(product.images).toHaveLength(3);
    // is_main first, then by position — never another product's photos.
    expect(product.img).toContain('8f2a.jpeg');
    expect(product.images[0]).toContain('8f2a.jpeg');
    expect(product.images[1]).toContain('9c1b.jpeg');
    expect(product.images[2]).toContain('7d4e.jpeg');
  });

  it('exposes variants carrying InventoryItem ids for order creation', async () => {
    const item = await apiFetch<DjangoItem>(ENDPOINTS.ITEM(1));
    const product = adaptItem(item);

    expect(product.variants.map((v) => v.inventoryId)).toEqual([10, 11]);
    expect(product.variants[0].colorLabel).toBe('White Gold');
    expect(product.variants[1].colorLabel).toBe('Rose Gold');
  });

  it('surfaces a 404 as a typed ApiRequestError', async () => {
    await expect(apiFetch(ENDPOINTS.ITEM(999))).rejects.toMatchObject({
      name: 'ApiRequestError',
      status: 404,
    });
  });
});

describe('cache safety', () => {
  // The wishlist-leak guard. Catalog reads feed `use cache`, whose key does not
  // include the user — a token here would serve one shopper's wishlist to all.
  it('sends no Authorization header on any catalog request', async () => {
    await apiFetchPaginated<DjangoItem>(ENDPOINTS.ITEMS);
    await apiFetch<DjangoItem>(ENDPOINTS.ITEM(1));
    await apiFetch(ENDPOINTS.STORE_CONFIG);

    expect(requestLog).toHaveLength(3);
    for (const entry of requestLog) {
      expect(entry.headers.get('authorization')).toBeNull();
    }
  });

  it('reports wishlist as false for anonymous catalog reads', async () => {
    const page = await apiFetchPaginated<DjangoItem>(ENDPOINTS.ITEMS);
    expect(adaptItems(page).every((product) => product.wished === false)).toBe(true);
  });
});

describe('store config', () => {
  it('reads the checkout gate', async () => {
    const config = await apiFetch<{ online_purchasing_enabled: boolean }>(
      ENDPOINTS.STORE_CONFIG,
    );
    expect(config.online_purchasing_enabled).toBe(true);
  });
});
