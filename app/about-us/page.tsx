import type { Metadata } from 'next';
import StorefrontShell from '@/components/layout/StorefrontShell';
import PageTransition from '@/components/motion/PageTransition';
import ContentPage, { EmptyState, RichText } from '@/components/pages/ContentPage';
import { getAboutUs } from '@/lib/api/cms';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Gemma Azzurro — pioneering lab-diamond fine jewelry. Founded in Los Angeles, certified in Cairo.',
  alternates: { canonical: '/about-us' },
};

export default async function AboutUsPage() {
  const about = await getAboutUs();

  return (
    <StorefrontShell>
      <PageTransition>
        <ContentPage eyebrow="Our House" title="About Gemma Azzurro">
          {about?.content ? (
            <RichText html={about.content} />
          ) : (
            <EmptyState>Our story is being written. Please check back shortly.</EmptyState>
          )}
        </ContentPage>
      </PageTransition>
    </StorefrontShell>
  );
}
