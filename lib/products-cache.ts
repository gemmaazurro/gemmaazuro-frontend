// Server-only cached data-access seam (Next 16 Cache Components — `use cache`).
// Today PRODUCTS is a static in-repo array (see ./data.ts), so this adds no real
// latency win yet — but it's the boundary a future Django-backed fetch drops into
// without touching any call site. Client components keep importing PRODUCTS directly
// from ./data.ts (they can't use the `use cache` directive — server-only).
import { cacheLife, cacheTag } from 'next/cache';
import { PRODUCTS, type Product } from './data';

export async function getProducts(): Promise<Product[]> {
  'use cache';
  cacheTag('products');
  cacheLife('days');
  return PRODUCTS;
}

export async function getProductById(id: string): Promise<Product | undefined> {
  'use cache';
  cacheTag('products', `product-${id}`);
  cacheLife('days');
  return PRODUCTS.find((p) => p.id === id);
}
