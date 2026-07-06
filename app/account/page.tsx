import type { Metadata } from 'next';
import StorefrontShell from '@/components/layout/StorefrontShell';
import PageTransition from '@/components/motion/PageTransition';
import AccountContent from '@/components/pages/AccountContent';

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

export default function AccountPage() {
  return (
    <StorefrontShell>
      <PageTransition>
        <AccountContent />
      </PageTransition>
    </StorefrontShell>
  );
}
