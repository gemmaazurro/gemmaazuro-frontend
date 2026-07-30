import type { Metadata } from 'next';
import { Suspense } from 'react';
import StorefrontShell from '@/components/layout/StorefrontShell';
import PageTransition from '@/components/motion/PageTransition';
import AccountData from '@/components/pages/AccountData';

export const metadata: Metadata = {
  title: 'Account',
  description: 'Manage your Gemma Azzurro account and review saved orders.',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: '/account',
  },
};

/** Matches the height of the signed-out form so the page does not jump. */
function AccountSkeleton() {
  return (
    <div style={{
      maxWidth: 'var(--page-width)', margin: '0 auto',
      padding: '48px clamp(20px,3vw,40px) 88px', minHeight: '70vh',
    }}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        <span style={{
          fontFamily: 'var(--font-wordmark)', fontSize: 11, letterSpacing: '0.2em',
          textTransform: 'uppercase', color: 'var(--color-brand)',
          display: 'block', marginBottom: 12,
        }}>Your Account</span>
        <div style={{
          height: 44, width: '60%', marginBottom: 32,
          borderRadius: 8, background: 'var(--color-surface)',
        }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ height: 52, borderRadius: 'var(--rounded-input)', background: 'var(--color-surface)' }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <StorefrontShell>
      <PageTransition>
        {/* The session lives in an httpOnly cookie, which Cache Components
            treats as uncached data — it has to stream inside a boundary or it
            blocks the whole route from prerendering. */}
        <Suspense fallback={<AccountSkeleton />}>
          <AccountData />
        </Suspense>
      </PageTransition>
    </StorefrontShell>
  );
}
