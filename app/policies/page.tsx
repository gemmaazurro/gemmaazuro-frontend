import type { Metadata } from 'next';
import StorefrontShell from '@/components/layout/StorefrontShell';
import PageTransition from '@/components/motion/PageTransition';
import ContentPage, { EmptyState, RichText } from '@/components/pages/ContentPage';
import Accordion from '@/components/core/Accordion';
import { getPolicies } from '@/lib/api/cms';

export const metadata: Metadata = {
  title: 'Policies',
  description: 'Returns and refunds, shipping, privacy and terms of service.',
  alternates: { canonical: '/policies' },
};

export default async function PoliciesPage() {
  const policies = await getPolicies();

  // One row holds all four policies; only show the ones with content.
  const sections = [
    { title: 'Returns & Refunds', body: policies?.return_refund },
    { title: 'Shipping & Delivery', body: policies?.shipping },
    { title: 'Privacy', body: policies?.privacy },
    { title: 'Terms of Service', body: policies?.service },
  ].filter((section) => section.body?.trim());

  return (
    <StorefrontShell>
      <PageTransition>
        <ContentPage eyebrow="The Fine Print" title="Policies">
          {sections.length === 0 ? (
            <EmptyState>Our policies are being published shortly.</EmptyState>
          ) : (
            <div style={{ borderTop: '1px solid var(--color-border)' }}>
              {sections.map((section, index) => (
                <Accordion key={section.title} title={section.title} defaultOpen={index === 0}>
                  <RichText html={section.body as string} />
                </Accordion>
              ))}
            </div>
          )}
        </ContentPage>
      </PageTransition>
    </StorefrontShell>
  );
}
