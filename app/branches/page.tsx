import type { Metadata } from 'next';
import StorefrontShell from '@/components/layout/StorefrontShell';
import PageTransition from '@/components/motion/PageTransition';
import ContentPage, { EmptyState } from '@/components/pages/ContentPage';
import { Pin, Phone, Clock, ArrowRight } from '@/components/core/Icons';
import { getBranches } from '@/lib/api/cms';

export const metadata: Metadata = {
  title: 'Visit Us',
  description: 'Gemma Azzurro showroom locations, opening hours and contact numbers.',
  alternates: { canonical: '/branches' },
};

export default async function BranchesPage() {
  const branches = await getBranches();

  return (
    <StorefrontShell>
      <PageTransition>
        <ContentPage
          eyebrow="Visit"
          title="Come and see them in person"
          intro="Photographs only go so far. Visit us to try pieces on, compare stones side by side, and talk through a custom design."
          wide
        >
          {branches.length === 0 ? (
            <EmptyState>Our showroom details are being added shortly.</EmptyState>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 'clamp(16px,2vw,24px)',
            }}>
              {branches.map((branch) => (
                <div key={branch.id} style={{
                  background: 'var(--color-surface)',
                  borderRadius: 'var(--rounded-block)',
                  padding: 'clamp(20px,3vw,28px)',
                  display: 'flex', flexDirection: 'column', gap: 14,
                }}>
                  <h2 style={{
                    margin: 0, fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: 19,
                  }}>{branch.area || 'Showroom'}</h2>

                  <ul style={{
                    listStyle: 'none', margin: 0, padding: 0,
                    display: 'flex', flexDirection: 'column', gap: 10,
                    fontSize: 14, lineHeight: 1.6, color: 'var(--color-foreground-muted)',
                  }}>
                    {branch.address && (
                      <li style={{ display: 'flex', gap: 10 }}>
                        <Pin size={16} style={{ flexShrink: 0, marginTop: 3 }} />
                        <span>{branch.address}</span>
                      </li>
                    )}
                    {branch.phone_numbers && (
                      <li style={{ display: 'flex', gap: 10 }}>
                        <Phone size={16} style={{ flexShrink: 0, marginTop: 3 }} />
                        <a href={`tel:${branch.phone_numbers.split(/[,/]/)[0].replace(/[^\d+]/g, '')}`}
                          style={{ color: 'inherit' }}>
                          {branch.phone_numbers}
                        </a>
                      </li>
                    )}
                    {branch.working_hours && (
                      <li style={{ display: 'flex', gap: 10 }}>
                        <Clock size={16} style={{ flexShrink: 0, marginTop: 3 }} />
                        <span>{branch.working_hours}</span>
                      </li>
                    )}
                  </ul>

                  {branch.location && (
                    <a href={branch.location} target="_blank" rel="noreferrer" style={{
                      marginTop: 'auto', display: 'inline-flex', alignItems: 'center', gap: 8,
                      fontSize: 14, fontWeight: 500, color: 'var(--color-brand)', textDecoration: 'none',
                    }}>
                      Open in maps <ArrowRight size={16} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </ContentPage>
      </PageTransition>
    </StorefrontShell>
  );
}
