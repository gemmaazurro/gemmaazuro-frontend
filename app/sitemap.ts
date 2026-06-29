import { MetadataRoute } from 'next';
import { PRODUCTS } from '@/lib/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://gemmaazuro-frontend.vercel.app';
  return [
    { url: base, lastModified: new Date() },
    { url: `${base}/collection`, lastModified: new Date() },
    ...PRODUCTS.map(p => ({ url: `${base}/products/${p.id}`, lastModified: new Date() })),
  ];
}
