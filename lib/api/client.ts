// Fetch-based API client, usable from RSC, route handlers, and client components.
//
// The single most important rule in this file: `token` is EXPLICIT and never
// implicit. Nothing reads cookies here. That is what keeps catalog reads
// anonymous and therefore safe to wrap in `use cache` — a cached response keyed
// without a user would otherwise serve one shopper's wishlist state to everyone.

import { getBackendUrl } from './config';
import type { Paginated } from './types';

export class ApiRequestError extends Error {
  readonly status: number;
  readonly fieldErrors?: Record<string, string[]>;

  constructor(status: number, message: string, fieldErrors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

export type QueryValue = string | number | boolean | Array<string | number> | undefined | null;

export interface ApiFetchOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  formData?: FormData;
  /** Explicit opt-in. Omit for anonymous (cacheable) reads. */
  token?: string | null;
  searchParams?: Record<string, QueryValue>;
  cache?: RequestCache;
  next?: { tags?: string[]; revalidate?: number | false };
  signal?: AbortSignal;
}

function buildUrl(path: string, searchParams?: Record<string, QueryValue>): string {
  const url = new URL(`${getBackendUrl()}${path.startsWith('/') ? path : `/${path}`}`);

  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value === undefined || value === null || value === '') continue;
      if (Array.isArray(value)) {
        for (const entry of value) url.searchParams.append(key, String(entry));
      } else {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url.toString();
}

/**
 * DRF returns errors in at least three shapes. Collapse them into one.
 *   { detail: "..." }            -- permissions, 404s
 *   { error: "..." }             -- the hand-rolled login view
 *   { field: ["msg", ...], ... } -- serializer validation
 */
function normalizeError(status: number, payload: unknown): ApiRequestError {
  if (payload && typeof payload === 'object') {
    const body = payload as Record<string, unknown>;

    if (typeof body.detail === 'string') return new ApiRequestError(status, body.detail);
    if (typeof body.error === 'string') return new ApiRequestError(status, body.error);

    const fieldErrors: Record<string, string[]> = {};
    for (const [key, value] of Object.entries(body)) {
      if (Array.isArray(value)) fieldErrors[key] = value.map(String);
      else if (typeof value === 'string') fieldErrors[key] = [value];
    }

    if (Object.keys(fieldErrors).length > 0) {
      const first = Object.entries(fieldErrors)[0];
      return new ApiRequestError(status, `${first[0]}: ${first[1][0]}`, fieldErrors);
    }
  }

  return new ApiRequestError(status, `Request failed with status ${status}`);
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { method = 'GET', body, formData, token, searchParams, cache, next, signal } = options;

  const headers: Record<string, string> = { Accept: 'application/json' };

  // Never set Content-Type for FormData — the browser must add the multipart
  // boundary itself, and overriding it makes Django parse an empty request.
  if (body !== undefined && !formData) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(buildUrl(path, searchParams), {
    method,
    headers,
    body: formData ?? (body !== undefined ? JSON.stringify(body) : undefined),
    cache,
    next,
    signal,
  });

  if (response.status === 204) return undefined as T;

  const text = await response.text();
  let payload: unknown = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }
  }

  if (!response.ok) throw normalizeError(response.status, payload);

  return payload as T;
}

export async function apiFetchPaginated<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<Paginated<T>> {
  const result = await apiFetch<Paginated<T> | T[]>(path, options);

  // Tolerate endpoints that return a bare array (several CMS ones do).
  if (Array.isArray(result)) {
    return { count: result.length, next: null, previous: null, results: result };
  }

  return result;
}

/** Page through everything. Used by sitemap / generateStaticParams. */
export async function fetchAllPages<T>(
  path: string,
  options: ApiFetchOptions = {},
  maxPages = 50,
): Promise<T[]> {
  const results: T[] = [];

  for (let page = 1; page <= maxPages; page += 1) {
    const chunk = await apiFetchPaginated<T>(path, {
      ...options,
      searchParams: { ...options.searchParams, page },
    });

    results.push(...chunk.results);
    if (!chunk.next) break;
  }

  return results;
}
