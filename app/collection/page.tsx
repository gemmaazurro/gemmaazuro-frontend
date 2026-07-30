import type { Metadata } from 'next';
import { Suspense } from 'react';
import StorefrontShell from '@/components/layout/StorefrontShell';
import PageTransition from '@/components/motion/PageTransition';
import CollectionContent from '@/components/pages/CollectionContent';
import { getAllProducts, getSubGroups } from '@/lib/products-cache';
import { absoluteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Collection',
  description: 'Browse Gemma Azzurro lab diamond rings, necklaces, bracelets, and earrings.',
  alternates: {
    canonical: '/collection',
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
    { '@type': 'ListItem', position: 2, name: 'Collection', item: absoluteUrl('/collection') },
  ],
};

/** Card-shaped placeholder shown for the instant before the filter resolves. */
function CollectionSkeleton({ count }: { count: number }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(256px, 1fr))',
      gap: 'clamp(16px,2vw,28px)',
    }}>
      {Array.from({ length: Math.min(count, 8) }).map((_, i) => (
        <div key={i} aria-hidden style={{
          aspectRatio: '3 / 4', borderRadius: 'var(--rounded-card)',
          background: 'var(--color-surface)',
        }} />
      ))}
    </div>
  );
}

export default async function CollectionPage() {
  const [products, subgroups] = await Promise.all([getAllProducts(), getSubGroups()]);

  return (
    <StorefrontShell>
      <PageTransition>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
        <div style={{ maxWidth: 'var(--page-width)', margin: '0 auto', padding: '40px clamp(20px,3vw,40px) 80px' }}>
          {/* CollectionContent reads ?subgroup= to preselect a filter. Search
              params are request data, so Cache Components needs them inside a
              boundary or the whole route stops prerendering. The fallback must
              not touch search params itself, hence a plain skeleton. */}
          <Suspense fallback={<CollectionSkeleton count={products.length} />}>
            <CollectionContent products={products} subgroups={subgroups} />
          </Suspense>
        </div>
      </PageTransition>
    </StorefrontShell>
  );
}
