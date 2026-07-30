import type { Metadata } from 'next';
import StorefrontShell from '@/components/layout/StorefrontShell';
import PageTransition from '@/components/motion/PageTransition';
import ContentPage, { EmptyState } from '@/components/pages/ContentPage';
import Accordion from '@/components/core/Accordion';
import { getFaqs } from '@/lib/api/cms';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description: 'Answers on lab diamonds, sizing, delivery, customization and care.',
  alternates: { canonical: '/faq' },
};

export default async function FaqPage() {
  const faqs = await getFaqs();

  return (
    <StorefrontShell>
      <PageTransition>
        <ContentPage eyebrow="Help" title="Frequently asked questions">
          {faqs.length === 0 ? (
            <EmptyState>We are adding answers here shortly.</EmptyState>
          ) : (
            <div style={{ borderTop: '1px solid var(--color-border)' }}>
              {faqs.map((faq) => (
                <Accordion key={faq.id} title={faq.question}>
                  {faq.answer}
                </Accordion>
              ))}
            </div>
          )}
        </ContentPage>
      </PageTransition>
    </StorefrontShell>
  );
}
