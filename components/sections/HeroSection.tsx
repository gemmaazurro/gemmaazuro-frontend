'use client';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Button from '../core/Button';
import SplitWords from '../motion/SplitWords';

export default function HeroSection() {
  return (
    <section style={{
      position: 'relative', minHeight: 'min(92vh, 700px)',
      display: 'flex', alignItems: 'center',
      backgroundImage: "url('/assets/hero-pattern.jpeg')",
      backgroundSize: 'cover', backgroundPosition: 'center',
      borderRadius: '0 0 var(--border-radius) var(--border-radius)', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', inset: 0,
        background: 'linear-gradient(100deg, rgba(18,22,46,0.58) 0%, rgba(18,22,46,0.2) 100%)' }} />
      <div style={{ position: 'relative', maxWidth: 'var(--page-width)', width: '100%',
        margin: '0 auto', padding: '80px clamp(20px,3vw,40px)' }}>
        <div style={{ maxWidth: 640 }}>
          <span style={{
            display: 'inline-block', fontFamily: 'var(--font-wordmark)', fontSize: 12,
            letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.82)',
            animation: 'ga-appear-up 0.5s ease 0.1s both', marginBottom: 22,
          }}>Egypt's Pioneering Lab Diamond House</span>
          <SplitWords text="Pioneering lab diamonds."
            tag="h1" baseDelay={0.2}
            style={{ fontFamily: 'var(--font-heading)', fontWeight: 500,
              fontSize: 'var(--title-lg)', lineHeight: 1, color: '#fff', marginBottom: 16, textWrap: 'balance' }} />
          <SplitWords text="Timeless by design."
            tag="p" baseDelay={0.55}
            style={{ fontFamily: 'var(--font-heading)', fontWeight: 400,
              fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', lineHeight: 1, color: 'rgba(255,255,255,0.88)', marginBottom: 30 }} />
          <p style={{ fontSize: 17, lineHeight: 1.6, color: 'rgba(255,255,255,0.85)', maxWidth: 480,
            marginBottom: 36, animation: 'ga-appear-up 0.6s ease 0.85s both' }}>
            Every piece IGI-certified — lab diamonds indistinguishable from mined, at a fraction of the cost.</p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', animation: 'ga-appear-up 0.5s ease 1.0s both' }}>
            <Link href="/collection">
              <Button variant="primary" size="lg" iconRight={<ArrowRight size={18} />}>Shop the Collection</Button>
            </Link>
            <Button variant="secondary" size="lg"
              style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.65)' }}>Customize a Piece</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
