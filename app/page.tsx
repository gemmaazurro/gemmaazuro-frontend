'use client';
import { Shield, Truck } from '@/components/core/Icons';
import StorefrontShell from '@/components/layout/StorefrontShell';
import HeroSection from '@/components/sections/HeroSection';
import BrandStory from '@/components/sections/BrandStory';
import Marquee from '@/components/motion/Marquee';
import RevealBlock from '@/components/motion/RevealBlock';
import RevealList from '@/components/motion/RevealList';
import ProductCard from '@/components/commerce/ProductCard';
import { Shield, Truck } from '@/components/core/Icons';
import { useStore } from '@/lib/store';
import { PRODUCTS } from '@/lib/data';

const marqItems = [
  <span key="1" style={{ color: 'var(--color-igi)', fontWeight: 600 }}>IGI Certified</span>,
  <span key="2">Lab Diamond — not mined</span>,
  <span key="3" style={{ color: 'var(--color-gold)', fontWeight: 500 }}>18k Gold · Sterling Silver</span>,
  <span key="4">Customization via WhatsApp</span>,
  <span key="5">Egypt · Los Angeles</span>,
  <span key="6" style={{ color: 'var(--color-brand)', fontWeight: 500 }}>Every piece certified</span>,
  <span key="7">Insured delivery — Cairo</span>,
];

const igiMarqItems = [
  <span key="a" style={{ fontSize: 13, fontFamily: 'var(--font-wordmark)', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--color-foreground-muted)' }}>IGI Certified</span>,
  <span key="b" style={{ fontSize: 13, fontFamily: 'var(--font-wordmark)', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--color-gold)' }}>18k Gold</span>,
  <span key="c" style={{ fontSize: 13, fontFamily: 'var(--font-wordmark)', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--color-foreground-muted)' }}>Sterling Silver</span>,
  <span key="d" style={{ fontSize: 13, fontFamily: 'var(--font-wordmark)', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--color-brand)' }}>Lab Diamond</span>,
  <span key="e" style={{ fontSize: 13, fontFamily: 'var(--font-wordmark)', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--color-foreground-muted)' }}>Los Angeles · Cairo</span>,
  <span key="f" style={{ fontSize: 13, fontFamily: 'var(--font-wordmark)', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--color-igi)' }}>Every Piece Certified ✦</span>,
];

const trustItems = [
  { Icon: Shield, title: 'IGI Certified', desc: 'A certificate accompanies every diamond.' },
  { Icon: Truck, title: 'Cairo Delivery', desc: 'Complimentary, insured delivery citywide.' },
  { Icon: Shield, title: 'Lifetime Care', desc: 'Cleaning, resizing & re-certification.' },
];

export default function HomePage() {
  const { wishlist, toggleWishlist, navigate } = useStore();
  const featured = PRODUCTS.slice(0, 4);

  return (
    <StorefrontShell>
      <HeroSection />
      <div style={{ background: 'var(--color-brand)', padding: '18px 0', overflow: 'hidden' }}>
        <Marquee items={marqItems} gap={72} speed={42}
          style={{ fontFamily: 'var(--font-body)', fontSize: 14, letterSpacing: '0.04em', color: '#fff' }} />
      </div>
      <section style={{ maxWidth: 'var(--page-width)', margin: '0 auto',
        padding: '56px clamp(20px,3vw,40px)',
        display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 32 }}>
        {trustItems.map(({ Icon, title, desc }, i) => (
          <RevealBlock key={i} delay={i * 0.12}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--color-brand)', flexShrink: 0, marginTop: 2 }}><Icon size={26} /></span>
              <div>
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: 17 }}>{title}</div>
                <div style={{ fontSize: 14, color: 'var(--color-foreground-muted)', marginTop: 5, lineHeight: 1.5 }}>{desc}</div>
              </div>
            </div>
          </RevealBlock>
        ))}
      </section>
      <section style={{ maxWidth: 'var(--page-width)', margin: '0 auto',
        padding: '16px clamp(20px,3vw,40px) 56px' }}>
        <RevealBlock>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
            <div>
              <span style={{ fontFamily: 'var(--font-wordmark)', fontSize: 11, letterSpacing: '0.2em',
                textTransform: 'uppercase', color: 'var(--color-brand)', display: 'block', marginBottom: 10 }}>New Arrivals</span>
              <h2 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontWeight: 500,
                fontSize: 'var(--text-4xl)', lineHeight: 1 }}>The Solitaire Edit</h2>
            </div>
            <button onClick={() => navigate('collection')} style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 500,
              color: 'var(--color-brand)', display: 'inline-flex', alignItems: 'center', gap: '0.625rem',
              padding: '0.625rem 1.25rem', borderRadius: 'var(--rounded-button)',
            }}>View all <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>
          </div>
        </RevealBlock>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 28 }}>
          <RevealList stagger={0.1}>
            {featured.map(p => (
              <ProductCard key={p.id} image={p.img} name={p.name} meta={p.meta} igi={p.igi}
                price={p.price} salePrice={p.salePrice} currency="EGP"
                wished={wishlist.includes(p.id)} onWishlist={() => toggleWishlist(p.id)}
                onClick={() => navigate('pdp', p.id)} data-cursor="View" />
            ))}
          </RevealList>
        </div>
      </section>
      <BrandStory />
      <div style={{ background: 'var(--color-surface)', padding: '22px 0',
        borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <Marquee gap={80} speed={55} items={igiMarqItems} />
      </div>
    </StorefrontShell>
  );
}
