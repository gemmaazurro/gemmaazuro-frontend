import type { Metadata } from 'next';
import StorefrontShell from '@/components/layout/StorefrontShell';
import WishlistContent from '@/components/pages/WishlistContent';

export const dynamic = 'force-static';

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
      <div style={{ maxWidth: 'var(--page-width)', margin: '0 auto',
        padding: '48px clamp(20px,3vw,40px) 88px', minHeight: '62vh' }}>
        <WishlistContent />
      </div>
    </StorefrontShell>
  );
}
