import type { Metadata } from 'next';
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
          <CollectionContent products={products} subgroups={subgroups} />
        </div>
      </PageTransition>
    </StorefrontShell>
  );
}
