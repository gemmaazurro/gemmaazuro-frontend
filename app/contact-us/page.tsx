import type { Metadata } from 'next';
import StorefrontShell from '@/components/layout/StorefrontShell';
import PageTransition from '@/components/motion/PageTransition';
import ContentPage from '@/components/pages/ContentPage';
import ContactForm from '@/components/pages/ContactForm';
import { getContactDetails } from '@/lib/api/cms';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Talk to Gemma Azzurro about a custom piece, sizing, engraving or an order.',
  alternates: { canonical: '/contact-us' },
};

export default async function ContactUsPage() {
  const contact = await getContactDetails();

  return (
    <StorefrontShell>
      <PageTransition>
        <ContentPage
          eyebrow="Get In Touch"
          title="Talk to us"
          intro="Custom designs, engraving, sizing or an existing order — tell us what you need and we will come back to you personally."
        >
          <ContactForm contact={contact} />
        </ContentPage>
      </PageTransition>
    </StorefrontShell>
  );
}
