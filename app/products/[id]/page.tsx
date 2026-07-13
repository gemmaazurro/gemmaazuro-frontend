import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProducts, getProductById } from '@/lib/products-cache';
import StorefrontShell from '@/components/layout/StorefrontShell';
import PageTransition from '@/components/motion/PageTransition';
import ProductDetailsClient from '@/components/pages/ProductDetailsClient';
import { absoluteUrl } from '@/lib/site';

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

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
  const description = `${product.meta}. Lab diamond fine jewelry from Gemma Azzurro.`;

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
  const [p, PRODUCTS] = await Promise.all([getProductById(id), getProducts()]);

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

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    image: absoluteUrl(p.img),
    description: p.meta,
    category: p.cat,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EGP',
      price: p.salePrice ?? p.price,
      availability: 'https://schema.org/InStock',
      url: absoluteUrl(`/products/${p.id}`),
    },
  };

  return (
    <StorefrontShell>
      <PageTransition>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
        <div style={{ maxWidth: 'var(--page-width)', margin: '0 auto', padding: '32px clamp(20px,3vw,40px) 64px' }}>
          <ProductDetailsClient product={p} related={related} thumbs={thumbs} />
        </div>
      </PageTransition>
    </StorefrontShell>
  );
}
