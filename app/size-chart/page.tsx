import type { Metadata } from 'next';
import StorefrontShell from '@/components/layout/StorefrontShell';
import PageTransition from '@/components/motion/PageTransition';
import ContentPage, { EmptyState, RichText } from '@/components/pages/ContentPage';
import { getSizeChart } from '@/lib/api/cms';
import { WA_PHONE } from '@/lib/contact';

export const metadata: Metadata = {
  title: 'Size Guide',
  description: 'Find your ring, bracelet and necklace size for Gemma Azzurro jewelry.',
  alternates: { canonical: '/size-chart' },
};

export default async function SizeChartPage() {
  const chart = await getSizeChart();

  return (
    <StorefrontShell>
      <PageTransition>
        <ContentPage
          eyebrow="Fit"
          title="Size guide"
          intro="Not sure of your size? Message us and we will help you measure at home, or resize any piece for you afterwards."
        >
          {chart?.content ? (
            <RichText html={chart.content} />
          ) : (
            <EmptyState>
              Our size guide is on its way. In the meantime,{' '}
              <a
                href={`https://wa.me/${WA_PHONE}?text=${encodeURIComponent('Hello, I need help finding my size.')}`}
                target="_blank"
                rel="noreferrer"
                style={{ color: 'var(--color-brand)' }}
              >
                message us on WhatsApp
              </a>{' '}
              and we will size you personally.
            </EmptyState>
          )}
        </ContentPage>
      </PageTransition>
    </StorefrontShell>
  );
}
