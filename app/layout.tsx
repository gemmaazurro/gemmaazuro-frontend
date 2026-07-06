import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import { Providers } from '@/components/Providers';
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
  description: 'IGI-certified lab diamonds. Rings, necklaces, bracelets & earrings. Founded in Los Angeles, pioneering in Cairo, Egypt.',
  keywords: ['lab diamond', 'IGI certified', 'fine jewelry', 'Cairo', 'Egypt'],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website', locale: 'en_EG', siteName: 'Gemma Azzurro',
    title: 'Gemma Azzurro — Lab Diamond Fine Jewelry Cairo',
    description: 'IGI-certified lab diamonds. Pioneering fine jewelry in Cairo, Egypt.',
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
    description: 'IGI-certified lab diamonds. Pioneering fine jewelry in Cairo, Egypt.',
    images: [absoluteUrl('/assets/hero-pattern.jpeg')],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={outfit.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
