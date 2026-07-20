// Server-only cached data-access seam (Next 16 Cache Components — `use cache`).
//
// CACHE SAFETY: every fetch in this file is ANONYMOUS — no token is ever passed
// to apiFetch. A `use cache` entry's key does not include the user, so a
// token-bearing request here would serve one shopper's `wishlist: true` to
// everyone. Real wishlist state is layered in client-side (see lib/store).
//
// Anything user-scoped (orders, profile, wishlist, cart) must NOT live here.

import { cacheLife, cacheTag } from 'next/cache';
import { apiFetch, apiFetchPaginated, fetchAllPages } from './api/client';
import { ENDPOINTS } from './api/endpoints';
import { adaptItem, adaptItems } from './api/adapters';
import type {
  DjangoGroup,
  DjangoItem,
  DjangoStoreConfig,
  DjangoSubGroup,
  Locale,
} from './api/types';
import type { Product } from './data';

export interface CatalogQuery {
  subgroup?: number;
  group?: number;
  search?: string;
  ordering?: string;
  price_min?: number;
  price_max?: number;
  page?: number;
  page_size?: number;
  locale?: Locale;
}

export interface CatalogPage {
  products: Product[];
  count: number;
  hasNext: boolean;
}

/**
 * Paginated catalog read. Filtering and ordering are pushed to Django's
 * ItemFilter (products/api/filters.py) rather than done client-side.
 */
export async function getProductsPage(query: CatalogQuery = {}): Promise<CatalogPage> {
  'use cache';
  cacheTag('products');
  cacheLife('hours');

  const { locale = 'en', ...params } = query;

  const page = await apiFetchPaginated<DjangoItem>(ENDPOINTS.ITEMS, {
    searchParams: { ...params },
  });

  return {
    products: adaptItems(page, locale),
    count: page.count,
    hasNext: Boolean(page.next),
  };
}

export async function getProducts(query: CatalogQuery = {}): Promise<Product[]> {
  'use cache';
  cacheTag('products');
  cacheLife('hours');

  const { products } = await getProductsPage(query);
  return products;
}

export async function getAllProducts(locale: Locale = 'en'): Promise<Product[]> {
  'use cache';
  cacheTag('products');
  cacheLife('hours');

  const items = await fetchAllPages<DjangoItem>(ENDPOINTS.ITEMS);
  return adaptItems(items, locale);
}

export async function getProductById(
  id: string,
  locale: Locale = 'en',
): Promise<Product | undefined> {
  'use cache';
  cacheTag('products', `product-${id}`);
  cacheLife('hours');

  try {
    const item = await apiFetch<DjangoItem>(ENDPOINTS.ITEM(id));
    return adaptItem(item, locale);
  } catch {
    return undefined;
  }
}

/** Related products, resolved server-side by shared subgroup. */
export async function getRelatedProducts(
  product: Product,
  limit = 4,
  locale: Locale = 'en',
): Promise<Product[]> {
  'use cache';
  cacheTag('products');
  cacheLife('hours');

  const subgroup = product.subgroupIds[0];
  if (subgroup === undefined) return [];

  const page = await apiFetchPaginated<DjangoItem>(ENDPOINTS.ITEMS, {
    searchParams: { subgroup, page_size: limit + 1 },
  });

  return adaptItems(page, locale)
    .filter((candidate) => candidate.id !== product.id)
    .slice(0, limit);
}

export interface SubGroupSummary {
  id: number;
  name: string;
  groupId: number | null;
}

export async function getSubGroups(locale: Locale = 'en'): Promise<SubGroupSummary[]> {
  'use cache';
  cacheTag('taxonomy');
  cacheLife('hours');

  const page = await apiFetchPaginated<DjangoSubGroup>(ENDPOINTS.SUBGROUPS);

  return page.results.map((subgroup) => ({
    id: subgroup.id,
    name:
      subgroup.translations_?.[locale]?.name ||
      subgroup.translations_?.en?.name ||
      subgroup.name ||
      '',
    groupId: subgroup.group ?? null,
  }));
}

export interface NavGroup {
  id: number;
  name: string;
  subgroups: SubGroupSummary[];
}

/** Mega-nav source: Groups with their SubGroups nested. */
export async function getGroupsWithSubGroups(locale: Locale = 'en'): Promise<NavGroup[]> {
  'use cache';
  cacheTag('taxonomy');
  cacheLife('hours');

  const [groupsPage, subgroups] = await Promise.all([
    apiFetchPaginated<DjangoGroup>(ENDPOINTS.GROUPS),
    getSubGroups(locale),
  ]);

  return groupsPage.results.map((group) => ({
    id: group.id,
    name:
      group.translations_?.[locale]?.name || group.translations_?.en?.name || group.name || '',
    subgroups: subgroups.filter((subgroup) => subgroup.groupId === group.id),
  }));
}

/**
 * Store config gates checkout entirely, so it gets a short cache life — a stale
 * `true` here would let customers into a checkout the store has switched off.
 */
export async function getStoreConfig(): Promise<DjangoStoreConfig | null> {
  'use cache';
  cacheTag('store-config');
  cacheLife('minutes');

  try {
    return await apiFetch<DjangoStoreConfig>(ENDPOINTS.STORE_CONFIG);
  } catch {
    return null;
  }
}
