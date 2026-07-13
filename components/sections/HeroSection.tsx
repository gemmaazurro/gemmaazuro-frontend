'use client';
import type { ReactNode } from 'react';
import { ArrowRight } from '@/components/core/Icons';
import Button from '../core/Button';
import { TextEffect } from '../core/text-effect';

interface HeroSectionProps {
  /** Marquee ribbon rendered directly under the hero copy, inside the same sized unit —
      keeps hero+ribbon as one guaranteed-visible block regardless of device (see svh below). */
  ribbon?: ReactNode;
}

export default function HeroSection({ ribbon }: HeroSectionProps) {
  return (
    <section style={{
      position: 'relative',
      // svh (small viewport height) is the SMALLEST the viewport can ever be — i.e. as if the
      // mobile browser's address bar is always showing. Unlike vh (inconsistent per device/
      // browser as the bar collapses) or dvh (recalculates live as the bar hides/shows, causing
      // a visible jump), svh is static: content sized to it is guaranteed fully visible no
      // matter the toolbar state, with zero live-resize glitching.
      minHeight: 'min(92svh, 700px)',
      display: 'flex', flexDirection: 'column',
      backgroundImage: "url('/assets/hero-pattern.jpeg')",
      backgroundSize: 'cover', backgroundPosition: 'center',
      overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', inset: 0,
        background: 'linear-gradient(100deg, rgba(18,22,46,0.58) 0%, rgba(18,22,46,0.2) 100%)' }} />
      <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center',
        maxWidth: 'var(--page-width)', width: '100%',
        margin: '0 auto', padding: 'clamp(2rem,5vw,4rem) clamp(20px,3vw,40px)' }}>
        <div style={{ maxWidth: 640 }}>
          <span style={{
            display: 'inline-block', fontFamily: 'var(--font-wordmark)', fontSize: 12,
            letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.82)',
            animation: 'ga-appear-up 0.5s ease 0.1s both', marginBottom: 22,
          }}>Egypt&apos;s Pioneering Lab Diamond House</span>
          <TextEffect as="h1" per="char" preset="fade" delay={0.2} speedReveal={2.2}
            style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, margin: 0,
              fontSize: 'var(--title-lg)', lineHeight: 1, color: '#fff', marginBottom: 16, textWrap: 'balance' }}>
            Pioneering lab diamonds.
          </TextEffect>
          <TextEffect as="p" per="char" preset="fade" delay={0.55} speedReveal={2.2}
            style={{ fontFamily: 'var(--font-heading)', fontWeight: 400, margin: 0,
              fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', lineHeight: 1, color: 'rgba(255,255,255,0.88)', marginBottom: 30 }}>
            Timeless by design.
          </TextEffect>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: 'rgba(255,255,255,0.85)', maxWidth: 480,
            marginBottom: 36, animation: 'ga-appear-up 0.6s ease 0.85s both' }}>
            Lab diamonds indistinguishable from mined, at a fraction of the cost.</p>
          <div className="mobile-stack" style={{ gap: 14, animation: 'ga-appear-up 0.5s ease 1.0s both' }}>
            <Button variant="primary" size="lg" as="a" href="/collection"
              iconRight={<ArrowRight size={18} />}>Shop the Collection</Button>
            <Button variant="secondary" size="lg" as="a" href="/collection"
              style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.65)' }}>Customize a Piece</Button>
          </div>
        </div>
      </div>
      {ribbon && <div style={{ position: 'relative' }}>{ribbon}</div>}
    </section>
  );
}
