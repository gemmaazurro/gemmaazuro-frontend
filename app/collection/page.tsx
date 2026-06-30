import type { Metadata } from 'next';
import StorefrontShell from '@/components/layout/StorefrontShell';
import CollectionContent from '@/components/pages/CollectionContent';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Collection',
  description: 'Browse Gemma Azzurro lab diamond rings, necklaces, bracelets, and earrings.',
  alternates: {
    canonical: '/collection',
  },
};

export default function CollectionPage() {
  return (
    <StorefrontShell>
      <main style={{ maxWidth: 'var(--page-width)', margin: '0 auto', padding: '40px clamp(20px,3vw,40px) 80px' }}>
        <CollectionContent />
      </main>
    </StorefrontShell>
  );
}
