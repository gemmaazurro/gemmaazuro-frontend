'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Shield, Heart } from '@/components/core/Icons';
import { PRODUCTS } from '@/lib/data';
import StorefrontShell from '@/components/layout/StorefrontShell';
import Accordion from '@/components/core/Accordion';
import Rating from '@/components/commerce/Rating';
import VariantSelector from '@/components/commerce/VariantSelector';
import WhatsAppCTA from '@/components/commerce/WhatsAppCTA';
import Button from '@/components/core/Button';
import ProductCard from '@/components/commerce/ProductCard';
import RevealBlock from '@/components/motion/RevealBlock';
import RevealList from '@/components/motion/RevealList';
import SplitWords from '@/components/motion/SplitWords';
import { useStore } from '@/lib/store';

export default function ProductPage({ params }: { params: { id: string } }) {
  const { wishlist, toggleWishlist, addToCart, navigate } = useStore();
  const p = PRODUCTS.find(x => x.id === params.id) || PRODUCTS[0];
  const [zoom, setZoom] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [thumbIdx, setThumbIdx] = useState(0);
  const wished = wishlist.includes(p.id);

  const related = PRODUCTS.filter(x => x.cat === p.cat && x.id !== p.id)
    .concat(PRODUCTS.filter(x => x.cat !== p.cat)).slice(0, 4);
  const thumbs = [p.img, PRODUCTS[(PRODUCTS.findIndex(x => x.id === p.id) + 1) % PRODUCTS.length].img, PRODUCTS[(PRODUCTS.findIndex(x => x.id === p.id) + 2) % PRODUCTS.length].img];

  const onMove = (e: React.MouseEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    setPos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  return (
    <StorefrontShell>
      <div style={{ maxWidth: 'var(--page-width)', margin: '0 auto', padding: 'clamp(40px,5vw,80px) clamp(20px,3vw,40px)' }}>
        <RevealBlock as="nav" style={{ fontSize: 13, color: 'var(--color-foreground-muted)', marginBottom: 28 }}>
          Home · {p.cat} · <span style={{ color: 'var(--color-foreground)' }}>{p.name}</span>
        </RevealBlock>

        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 'clamp(28px,5vw,72px)', alignItems: 'start' }}>
          <RevealBlock delay={0.05} style={{ display: 'flex', gap: 14, position: 'sticky', top: 120 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {thumbs.map((src, i) => (
                <div key={i} onClick={() => setThumbIdx(i)} style={{
                  width: 68, height: 88, borderRadius: 10, overflow: 'hidden', background: '#fcfcfd',
                  border: thumbIdx === i ? '1.5px solid var(--color-brand)' : '1px solid var(--color-border)',
                  cursor: 'pointer', transition: 'border-color 0.2s ease', position: 'relative',
                }}>
                  <Image src={src} alt="" width={68} height={88} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
            <div onMouseEnter={() => setZoom(true)} onMouseLeave={() => setZoom(false)} onMouseMove={onMove}
              data-cursor={zoom ? '' : 'Zoom'}
              style={{ flex: 1, aspectRatio: '3/4', background: '#fcfcfd', borderRadius: 'var(--rounded-block)',
                overflow: 'hidden', cursor: zoom ? 'zoom-out' : 'crosshair', position: 'relative' }}>
              <Image src={thumbs[thumbIdx]} alt={p.name} fill style={{
                width: '100%', height: '100%', objectFit: 'cover',
                transform: zoom ? 'scale(2.2)' : 'scale(1)',
                transformOrigin: `${pos.x}% ${pos.y}%`,
                transition: zoom ? 'none' : 'transform 0.4s var(--ease-default)' }} />
            </div>
          </RevealBlock>

          <RevealBlock delay={0.12}>
            <SplitWords text={p.name} tag="h1" baseDelay={0.18}
              style={{ margin: '0 0 8px', fontFamily: 'var(--font-heading)', fontWeight: 500,
                fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', lineHeight: 1.05 }} />
            <p style={{ margin: '0 0 14px', color: 'var(--color-foreground-muted)', fontSize: 15 }}>{p.meta}</p>
            <Rating value={p.rating} count={p.reviews} style={{ marginBottom: 22 }} />

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 22 }}>
              {p.salePrice ? (
                <>
                  <span style={{ fontSize: 32, fontWeight: 600, color: 'var(--color-sale-price)' }}>{p.salePrice.toLocaleString()} EGP</span>
                  <span style={{ fontSize: 18, color: 'var(--color-foreground-muted)', textDecoration: 'line-through' }}>{p.price.toLocaleString()} EGP</span>
                </>
              ) : <span style={{ fontSize: 32, fontWeight: 500 }}>{p.price.toLocaleString()} EGP</span>}
            </div>

            <div style={{ background: 'var(--color-igi-bg)', borderRadius: 'var(--rounded-card)',
              padding: '16px 20px', marginBottom: 28, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--color-igi)', flexShrink: 0, marginTop: 2 }}><Shield size={22} /></span>
              <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--color-igi)' }}>
                <strong style={{ fontWeight: 600, display: 'block', marginBottom: 2 }}>IGI Certified Lab Diamond</strong>
                <span style={{ opacity: 0.85 }}>{p.color} · {p.clarity} · {p.carat} · {p.cut} cut</span>
                <br /><span style={{ opacity: 0.7 }}>Certificate #{p.cert}</span>
                <span style={{ marginLeft: 14, cursor: 'pointer', textDecoration: 'underline' }}>Verify on IGI →</span>
              </div>
            </div>

            <VariantSelector label="Metal" style={{ marginBottom: 20 }} options={[
              { label: '18k White Gold', value: 'wg' }, { label: '18k Yellow Gold', value: 'yg' }, { label: 'Sterling Silver', value: 'ss' }]} />
            <VariantSelector label="Ring Size" style={{ marginBottom: 28 }}
              options={['5','5.5','6','6.5','7','7.5'].map(s => ({ label: s, value: s }))} />

            <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
              <Button variant="primary" size="lg" fullWidth onClick={() => addToCart(p)}>Add to Cart</Button>
              <button aria-label="Wishlist" onClick={() => toggleWishlist(p.id)} style={{
                width: 58, flexShrink: 0, borderRadius: 'var(--rounded-button)',
                border: '2px solid var(--color-border-dark)', background: '#fff', cursor: 'pointer',
                color: wished ? 'var(--color-sale-price)' : 'var(--color-foreground)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'color 0.2s ease, border-color 0.2s ease',
              }}>
                <Heart size={20} fill={wished ? 'currentColor' : 'none'} />
              </button>
            </div>

            <WhatsAppCTA message={`Hi Gemma Azzurro, I'd like to customize the ${p.name}.`}
              label="Customize or engrave via WhatsApp" style={{ marginBottom: 32 }} />

            <div style={{ borderTop: '1px solid var(--color-border)' }}>
              <Accordion title="Materials & Specifications" defaultOpen>
                {p.stone} · {p.carat} · {p.color}/{p.clarity} · {p.cut} cut. {p.meta}.
              </Accordion>
              <Accordion title="Care Guide">Store in the pouch provided, away from moisture. Clean gently with a soft cloth. Complimentary professional cleaning in-store.</Accordion>
              <Accordion title="Shipping & Returns">Complimentary insured delivery across Cairo. 14-day returns — contact us or visit the Zamalek atelier.</Accordion>
              <Accordion title="IGI Certificate">Certificate #{p.cert}. A printed certificate and QR verification code accompany your piece.</Accordion>
            </div>
          </RevealBlock>
        </div>

        <section style={{ marginTop: 88 }}>
          <RevealBlock>
            <h2 style={{ margin: '0 0 28px', fontFamily: 'var(--font-heading)', fontWeight: 500,
              fontSize: 'var(--text-3xl)', lineHeight: 1 }}>You may also like</h2>
          </RevealBlock>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 28 }}>
            <RevealList stagger={0.08}>
              {related.map(r => (
                <ProductCard key={r.id} image={r.img} name={r.name} meta={r.meta} igi={r.igi}
                  price={r.price} salePrice={r.salePrice} currency="EGP"
                  wished={wishlist.includes(r.id)} onWishlist={() => toggleWishlist(r.id)}
                  onClick={() => navigate('pdp', r.id)} />
              ))}
            </RevealList>
          </div>
        </section>
      </div>
    </StorefrontShell>
  );
}
