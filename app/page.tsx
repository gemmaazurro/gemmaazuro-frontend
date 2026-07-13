import type { Metadata } from 'next';
import StorefrontShell from '@/components/layout/StorefrontShell';
import PageTransition from '@/components/motion/PageTransition';
import HeroSection from '@/components/sections/HeroSection';
import BrandStory from '@/components/sections/BrandStory';
import { InfiniteSlider } from '@/components/core/infinite-slider';
import RevealBlock from '@/components/motion/RevealBlock';
import { Shield, Truck } from '@/components/core/Icons';
import HomeFeaturedProducts from '@/components/pages/HomeFeaturedProducts';

// Next 16 Cache Components (cacheComponents: true in next.config.ts) replaces the old
// `export const revalidate` segment config — this page has no server data fetch of its
// own (HomeFeaturedProducts reads the static PRODUCTS array client-side), so there's
// nothing here that needs a `use cache` boundary; see lib/products-cache.ts for the
// one that exists (PDP metadata + static params).

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
};

const marqItems = [
  <span key="2">Lab Diamond — not mined</span>,
  <span key="3" style={{ color: 'var(--color-gold)', fontWeight: 500 }}>18k Gold · Sterling Silver</span>,
  <span key="4">Customization via WhatsApp</span>,
  <span key="5">Egypt · Los Angeles</span>,
  <span key="7">Insured delivery — Cairo</span>,
];

const igiMarqItems = [
  <span key="b" style={{ fontSize: 13, fontFamily: 'var(--font-wordmark)', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--color-gold)' }}>18k Gold</span>,
  <span key="c" style={{ fontSize: 13, fontFamily: 'var(--font-wordmark)', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--color-foreground-muted)' }}>Sterling Silver</span>,
  <span key="d" style={{ fontSize: 13, fontFamily: 'var(--font-wordmark)', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--color-brand)' }}>Lab Diamond</span>,
  <span key="e" style={{ fontSize: 13, fontFamily: 'var(--font-wordmark)', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--color-foreground-muted)' }}>Los Angeles · Cairo</span>,
];

const trustItems = [
  { Icon: Truck, title: 'Cairo Delivery', desc: 'Complimentary, insured delivery citywide.' },
  { Icon: Shield, title: 'Lifetime Care', desc: 'Cleaning, resizing & polishing.' },
  { Icon: Shield, title: 'Custom & Engrave', desc: 'Personalize any piece via WhatsApp.' },
];

export default function HomePage() {
  return (
    <StorefrontShell>
      <PageTransition>
        <HeroSection />
        <div style={{ background: 'var(--color-brand)', padding: '18px 0' }}>
          <InfiniteSlider gap={72} speed={50} speedOnHover={20}
            style={{ fontFamily: 'var(--font-body)', fontSize: 14, letterSpacing: '0.04em', color: '#fff' }}>
            {marqItems.map((item, i) => (
              <span key={i} style={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 10 }}>{item}</span>
            ))}
          </InfiniteSlider>
        </div>
        <HomeFeaturedProducts />
        <BrandStory />
        <section style={{ maxWidth: 'var(--page-width)', margin: '0 auto',
          padding: '56px clamp(20px,3vw,40px)',
          display: 'grid', gridTemplateColumns: 'var(--grid-trust)', gap: 32 }}>
          {trustItems.map(({ Icon, title, desc }, i) => (
            <RevealBlock key={i} delay={i * 0.12}>
              <div style={{
                display: 'flex', gap: 16, alignItems: 'flex-start',
                background: 'var(--color-surface)',
                borderRadius: 'var(--border-radius)',
                padding: 'clamp(20px, 3vw, 28px)',
                boxShadow: 'var(--shadow-card-subtle)',
              }}>
                <span style={{ color: 'var(--color-brand)', flexShrink: 0, marginTop: 2 }}><Icon size={26} /></span>
                <div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: 17 }}>{title}</div>
                  <div style={{ fontSize: 14, color: 'var(--color-foreground-muted)', marginTop: 5, lineHeight: 1.5 }}>{desc}</div>
                </div>
              </div>
            </RevealBlock>
          ))}
        </section>
        <div style={{ background: 'var(--color-surface)', padding: '22px 0',
          borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
          <InfiniteSlider gap={80} speed={36} speedOnHover={16}>
            {igiMarqItems.map((item, i) => (
              <span key={i} style={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 10 }}>{item}</span>
            ))}
          </InfiniteSlider>
        </div>
      </PageTransition>
    </StorefrontShell>
  );
}
