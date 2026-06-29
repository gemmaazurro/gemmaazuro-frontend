import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Shield } from 'lucide-react';
import { PRODUCTS } from '@/lib/data';
import StorefrontShell from '@/components/layout/StorefrontShell';
import Badge from '@/components/core/Badge';
import Accordion from '@/components/core/Accordion';
import Rating from '@/components/commerce/Rating';
import VariantSelector from '@/components/commerce/VariantSelector';
import WhatsAppCTA from '@/components/commerce/WhatsAppCTA';
import Button from '@/components/core/Button';

export function generateStaticParams() {
  return PRODUCTS.map(p => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return {};
  return {
    title: p.name,
    description: `${p.name} — ${p.meta}. ${p.igi}. ${(p.salePrice || p.price).toLocaleString()} EGP. IGI certified lab diamond.`,
    openGraph: { title: p.name, images: [{ url: p.img }] },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) notFound();

  const accordionItems = [
    { title: 'Details & Specifications', content: `${p.stone} · ${p.carat} · Cut: ${p.cut} · Color: ${p.color} · Clarity: ${p.clarity}` },
    { title: 'IGI Certification', content: `Certificate number: ${p.cert}. Every Gemma Azzurro diamond is IGI-certified, ensuring traceability, quality, and peace of mind.` },
    { title: 'Care & Warranty', content: 'Complimentary lifetime cleaning, resizing, and re-certification. Bring your piece in any time — we take care of it for life.' },
    { title: 'Shipping & Delivery', content: 'Complimentary insured delivery across Cairo. Orders processed within 1–2 business days. Custom and engraved pieces may require 3–5 additional days.' },
  ];

  return (
    <StorefrontShell>
      <div style={{ maxWidth: 'var(--page-width)', margin: '0 auto',
        padding: 'clamp(40px,5vw,80px) clamp(20px,3vw,40px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px,5vw,80px)', alignItems: 'start' }}>
          <div style={{ position: 'relative', aspectRatio: '3/4', borderRadius: 'var(--rounded-block)',
            overflow: 'hidden', background: 'var(--color-surface)', boxShadow: 'var(--shadow-raised)' }}>
            <Image src={p.img} alt={p.name} fill style={{ objectFit: 'cover' }} priority />
          </div>

          <div style={{ paddingTop: 16 }}>
            <span style={{ fontFamily: 'var(--font-wordmark)', fontSize: 11, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: 'var(--color-brand)', display: 'block', marginBottom: 12 }}>
              {p.cat}
            </span>
            <h1 style={{ fontSize: 'var(--text-4xl)', fontWeight: 500, marginBottom: 16, lineHeight: 1.05 }}>{p.name}</h1>
            <Rating value={p.rating} count={p.reviews} />

            <div style={{ margin: '20px 0', display: 'flex', gap: 8 }}>
              <Badge variant="igi"><Shield size={11} /> {p.igi}</Badge>
              <Badge variant="default">{p.meta}</Badge>
            </div>

            <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--rounded-card)',
              padding: '20px 24px', marginBottom: 24 }}>
              {[
                ['Stone', p.stone], ['Carat', p.carat], ['Cut', p.cut],
                ['Color', p.color], ['Clarity', p.clarity], ['Certificate', p.cert],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between',
                  padding: '8px 0', borderBottom: '1px solid var(--color-border)',
                  fontSize: 14 }}>
                  <span style={{ color: 'var(--color-foreground-muted)' }}>{k}</span>
                  <span style={{ fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>

            <VariantSelector label="Metal" options={['18k White Gold', '18k Yellow Gold', 'Platinum']} />
            <div style={{ marginTop: 16, marginBottom: 24 }}>
              <VariantSelector label="Size" options={['5', '5.5', '6', '6.5', '7', '7.5', '8']} />
            </div>

            <div style={{ marginBottom: 28 }}>
              {p.salePrice ? (
                <div style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
                  <span style={{ fontSize: 'var(--text-3xl)', fontWeight: 600, color: 'var(--color-sale-price)' }}>
                    {p.salePrice.toLocaleString()} EGP</span>
                  <span style={{ fontSize: 'var(--text-xl)', color: 'var(--color-foreground-muted)', textDecoration: 'line-through' }}>
                    {p.price.toLocaleString()} EGP</span>
                </div>
              ) : (
                <span style={{ fontSize: 'var(--text-3xl)', fontWeight: 600 }}>{p.price.toLocaleString()} EGP</span>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
              <Button variant="primary" size="lg" style={{ justifyContent: 'center' }}>Add to Cart</Button>
              <WhatsAppCTA productName={p.name} style={{ justifyContent: 'center' }} />
            </div>

            <Accordion items={accordionItems} />
          </div>
        </div>
      </div>
    </StorefrontShell>
  );
}
