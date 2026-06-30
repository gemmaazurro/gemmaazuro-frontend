import { MetadataRoute } from 'next';
import { PRODUCTS } from '@/lib/data';
import { absoluteUrl } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl('/'), lastModified: new Date() },
    { url: absoluteUrl('/collection'), lastModified: new Date() },
    { url: absoluteUrl('/wishlist'), lastModified: new Date() },
    { url: absoluteUrl('/account'), lastModified: new Date() },
    ...PRODUCTS.map((p) => ({ url: absoluteUrl(`/products/${p.id}`), lastModified: new Date() })),
  ];
}
