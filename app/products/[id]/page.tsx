import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProducts, getProductById, getRelatedProducts } from '@/lib/products-cache';
import StorefrontShell from '@/components/layout/StorefrontShell';
import PageTransition from '@/components/motion/PageTransition';
import ProductDetailsClient from '@/components/pages/ProductDetailsClient';
import { absoluteUrl } from '@/lib/site';

export async function generateStaticParams() {
  // Guarded: an unreachable backend must not fail the whole build. Falling back
  // to [] renders every PDP on demand instead.
  try {
    const products = await getProducts();
    return products.map((product) => ({ id: product.id }));
  } catch {
    return [];
  }
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
  const p = await getProductById(id);

  if (!p) {
    notFound();
  }

  // Real related items (shared subgroup) and this product's OWN gallery.
  // Previously both were faked: `related` padded with unrelated products and
  // `thumbs` spliced in other products' photos.
  const related = await getRelatedProducts(p, 4);
  const thumbs = p.images.length > 0 ? p.images : [p.img];

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
      availability: p.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
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
