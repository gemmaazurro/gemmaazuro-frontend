import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PRODUCTS } from '@/lib/data';
import StorefrontShell from '@/components/layout/StorefrontShell';
import PageTransition from '@/components/motion/PageTransition';
import ProductDetailsClient from '@/components/pages/ProductDetailsClient';
import { absoluteUrl } from '@/lib/site';

export const revalidate = 3600;

export async function generateStaticParams() {
  return PRODUCTS.map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = PRODUCTS.find((item) => item.id === id);

  if (!product) {
    return {
      title: 'Product Not Found',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${product.name} | Gemma Azzurro`;
  const description = `${product.meta}. ${product.igi}. IGI-certified lab diamond fine jewelry from Gemma Azzurro.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/products/${product.id}`,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `/products/${product.id}`,
      images: [
        {
          url: absoluteUrl(product.img),
          width: 1200,
          height: 1600,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [absoluteUrl(product.img)],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = PRODUCTS.find((item) => item.id === id);

  if (!p) {
    notFound();
  }

  const currentIndex = PRODUCTS.findIndex((item) => item.id === p.id);
  const related = PRODUCTS.filter((item) => item.cat === p.cat && item.id !== p.id)
    .concat(PRODUCTS.filter((item) => item.cat !== p.cat))
    .slice(0, 4);
  const thumbs = [
    p.img,
    PRODUCTS[(currentIndex + 1) % PRODUCTS.length].img,
    PRODUCTS[(currentIndex + 2) % PRODUCTS.length].img,
  ];

  return (
    <StorefrontShell>
      <PageTransition>
        <div style={{ maxWidth: 'var(--page-width)', margin: '0 auto', padding: '32px clamp(20px,3vw,40px) 64px' }}>
          <ProductDetailsClient product={p} related={related} thumbs={thumbs} />
        </div>
      </PageTransition>
    </StorefrontShell>
  );
}
