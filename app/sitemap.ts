import { MetadataRoute } from 'next';
import { getAllProducts } from '@/lib/products-cache';
import { absoluteUrl } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    { url: absoluteUrl('/'), lastModified: new Date() },
    { url: absoluteUrl('/collection'), lastModified: new Date() },
    { url: absoluteUrl('/wishlist'), lastModified: new Date() },
    { url: absoluteUrl('/account'), lastModified: new Date() },
  ];

  // A sitemap is not worth failing the build over — if the backend is
  // unreachable, ship the static routes rather than throwing.
  try {
    const products = await getAllProducts();
    return [
      ...staticRoutes,
      ...products.map((product) => ({
        url: absoluteUrl(`/products/${product.id}`),
        lastModified: new Date(),
      })),
    ];
  } catch {
    return staticRoutes;
  }
}
