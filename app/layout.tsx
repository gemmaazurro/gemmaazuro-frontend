import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import { Providers } from '@/components/Providers';
import { getGroupsWithSubGroups, getProducts, getSubGroups } from '@/lib/products-cache';
import type { CatalogValue } from '@/lib/catalog-context';
import { absoluteUrl, getSiteUrl } from '@/lib/site';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-outfit',
  display: 'swap',
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: { default: 'Gemma Azzurro — Lab Diamond Fine Jewelry Cairo', template: '%s | Gemma Azzurro' },
  description: 'Lab diamonds. Rings, necklaces, bracelets & earrings. Founded in Los Angeles, pioneering in Cairo, Egypt.',
  keywords: ['lab diamond', 'fine jewelry', 'Cairo', 'Egypt'],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website', locale: 'en_EG', siteName: 'Gemma Azzurro',
    title: 'Gemma Azzurro — Lab Diamond Fine Jewelry Cairo',
    description: 'Lab diamonds. Pioneering fine jewelry in Cairo, Egypt.',
    url: '/',
    images: [
      {
        url: absoluteUrl('/assets/hero-pattern.jpeg'),
        width: 1600,
        height: 1067,
        alt: 'Gemma Azzurro lab diamond jewelry',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gemma Azzurro — Lab Diamond Fine Jewelry Cairo',
    description: 'Lab diamonds. Pioneering fine jewelry in Cairo, Egypt.',
    images: [absoluteUrl('/assets/hero-pattern.jpeg')],
  },
  robots: { index: true, follow: true },
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'JewelryStore',
  name: 'Gemma Azzurro',
  description: 'Pioneering lab-diamond fine jewelry. Founded in Los Angeles, pioneering in Cairo, Egypt.',
  url: getSiteUrl(),
  image: absoluteUrl('/assets/logo-wordmark.png'),
  address: { '@type': 'PostalAddress', addressLocality: 'Zamalek, Cairo', addressCountry: 'EG' },
  sameAs: [] as string[],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Nav taxonomy + a product sample, fetched once for every route. Guarded so an
  // unreachable backend degrades the nav instead of failing the whole render.
  let catalog: CatalogValue = { navGroups: [], subgroups: [], products: [] };
  try {
    const [navGroups, subgroups, products] = await Promise.all([
      getGroupsWithSubGroups(),
      getSubGroups(),
      getProducts(),
    ]);
    catalog = { navGroups, subgroups, products };
  } catch {
    // Keep the empty default.
  }

  return (
    <html lang="en" className={outfit.variable} suppressHydrationWarning>
      <body>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Providers catalog={catalog}>{children}</Providers>
      </body>
    </html>
  );
}
