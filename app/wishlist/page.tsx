import type { Metadata } from 'next';
import StorefrontShell from '@/components/layout/StorefrontShell';
import PageTransition from '@/components/motion/PageTransition';
import WishlistContent from '@/components/pages/WishlistContent';

export const metadata: Metadata = {
  title: 'Wishlist',
  description: 'View your saved Gemma Azzurro pieces.',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: '/wishlist',
  },
};

export default function WishlistPage() {
  return (
    <StorefrontShell>
      <PageTransition>
        <div style={{ maxWidth: 'var(--page-width)', margin: '0 auto',
          padding: '48px clamp(20px,3vw,40px) 88px', minHeight: '62vh' }}>
          <WishlistContent />
        </div>
      </PageTransition>
    </StorefrontShell>
  );
}
