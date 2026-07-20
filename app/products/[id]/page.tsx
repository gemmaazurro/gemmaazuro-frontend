import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProducts, getProductById, getRelatedProducts } from '@/lib/products-cache';
import StorefrontShell from '@/components/layout/StorefrontShell';
import PageTransition from '@/components/motion/PageTransition';
import ProductDetailsClient from '@/components/pages/ProductDetailsClient';
import { absoluteUrl } from '@/lib/site';

/**
 * Sentinel used when the backend is unreachable at build time.
 *
 * Cache Components requires generateStaticParams to return at least one param
 * so it can validate the route has no stray cookies()/headers()/searchParams
 * access — an empty array is a hard build error. Returning a param that cannot
 * match a real product satisfies that check; the page notFound()s it.
 */
const PLACEHOLDER_ID = '__placeholder__';

export async function generateStaticParams() {
  // The backend is not reachable from every build environment (Vercel builds
  // cannot see a local or private Django). Degrade to rendering PDPs on demand
  // rather than failing the whole deployment.
  try {
    const products = await getProducts();
    if (products.length > 0) {
      return products.map((product) => ({ id: product.id }));
    }
  } catch {
    // fall through to the sentinel
  }

  return [{ id: PLACEHOLDER_ID }];
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = id === PLACEHOLDER_ID ? undefined : await getProductById(id);

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

  // The build-time sentinel is never a real product.
  if (id === PLACEHOLDER_ID) {
    notFound();
  }

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
