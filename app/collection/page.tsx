import type { Metadata } from 'next';
import StorefrontShell from '@/components/layout/StorefrontShell';
import CollectionGrid from '@/components/sections/CollectionGrid';

export const metadata: Metadata = {
  title: 'Shop Lab Diamond Jewelry',
  description: 'Browse IGI-certified lab diamond rings, necklaces, bracelets and earrings. Transparent pricing, Cairo delivery.',
};

export default function CollectionPage() {
  return (
    <StorefrontShell>
      <div style={{ maxWidth: 'var(--page-width)', margin: '0 auto',
        padding: 'clamp(40px,5vw,80px) clamp(20px,3vw,40px)' }}>
        <div style={{ marginBottom: 48, textAlign: 'center' }}>
          <span style={{ fontFamily: 'var(--font-wordmark)', fontSize: 11, letterSpacing: '0.2em',
            textTransform: 'uppercase', color: 'var(--color-brand)', display: 'block', marginBottom: 14 }}>
            IGI Certified · Cairo
          </span>
          <h1 style={{ fontWeight: 500, fontSize: 'var(--text-5xl)', lineHeight: 1 }}>The Collection</h1>
        </div>
        <CollectionGrid />
      </div>
    </StorefrontShell>
  );
}
