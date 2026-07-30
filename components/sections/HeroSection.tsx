'use client';
import { useEffect, useState, type ReactNode } from 'react';
import { ArrowRight } from '@/components/core/Icons';
import Button from '../core/Button';
import { TextEffect } from '../core/text-effect';
import type { Slide } from '@/lib/api/cms';

/** The shipped artwork, used whenever no hero photo has been uploaded. */
const FALLBACK_HERO = '/assets/hero-pattern.jpeg';

const HERO_ROTATE_MS = 6000;

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

interface HeroSectionProps {
  /** Marquee ribbon rendered directly under the hero copy, inside the same sized unit —
      keeps hero+ribbon as one guaranteed-visible block regardless of device (see svh below). */
  ribbon?: ReactNode;
  /**
   * Hero photos managed from the dashboard (Hero rows with placement="hero").
   * Empty falls back to the shipped artwork rather than rendering a blank hero.
   */
  slides?: Slide[];
}

export default function HeroSection({ ribbon, slides = [] }: HeroSectionProps) {
  const [index, setIndex] = useState(0);

  // Crossfade between uploaded photos. A single photo (or reduced motion)
  // stays put — no timer, nothing to clean up.
  useEffect(() => {
    if (slides.length < 2 || prefersReduced()) return;

    const timer = setInterval(
      () => setIndex((current) => (current + 1) % slides.length),
      HERO_ROTATE_MS,
    );

    return () => clearInterval(timer);
  }, [slides.length]);

  const active = slides[index];

  // Editors can override the designed headline per photo, but an empty title
  // must not blank it — fall back to the brand copy.
  const heading = active?.title?.trim() || 'Pioneering lab diamonds.';
  const body = active?.description?.trim() || 'Lab diamonds indistinguishable from mined, at a fraction of the cost.';

  return (
    <section className="ga-hero" style={{
      position: 'relative',
      display: 'flex', flexDirection: 'column',
      // Only paint the fallback here. Uploaded photos are layered below so
      // they can crossfade, and a video cannot be a background-image at all.
      ...(slides.length === 0
        ? {
            backgroundImage: `url('${FALLBACK_HERO}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }
        : { background: 'var(--color-foreground)' }),
      overflow: 'hidden',
    }}>
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          aria-hidden={i !== index}
          style={{
            position: 'absolute', inset: 0,
            opacity: i === index ? 1 : 0,
            transition: 'opacity 1.1s ease',
          }}
        >
          {slide.isVideo ? (
            // Hero.file accepts any upload, so a slide may be footage.
            <video
              src={slide.src}
              autoPlay
              muted
              loop
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              backgroundImage: `url('${slide.src}')`,
              backgroundSize: 'cover', backgroundPosition: 'center',
            }} />
          )}
        </div>
      ))}
      <style>{`
        /* svh (small viewport height) is the SMALLEST the viewport can ever be — i.e. as if the
           mobile browser's address bar is always showing. Unlike vh (inconsistent per device/
           browser as the bar collapses) or dvh (recalculates live as the bar hides/shows,
           visibly jumping), svh is static: content sized to it is always fully visible no
           matter the toolbar state, with zero live-resize glitching.
           Mobile: fill the FULL screen (hero+ribbon flush with the bottom edge) — a partial-
           height hero reads as a bug on a phone. Desktop: a contained, composed hero (92% capped
           at 700px) so the next section peeks in, which doesn't apply on a full-bleed mobile view. */
        .ga-hero { min-height: 100svh; }
        @media (min-width: 768px) {
          .ga-hero { min-height: min(92svh, 700px); }
        }
      `}</style>
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
          <TextEffect key={heading} as="h1" per="char" preset="fade" delay={0.2} speedReveal={2.2}
            style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, margin: 0,
              fontSize: 'var(--title-lg)', lineHeight: 1, color: '#fff', marginBottom: 16, textWrap: 'balance' }}>
            {heading}
          </TextEffect>
          <TextEffect as="p" per="char" preset="fade" delay={0.55} speedReveal={2.2}
            style={{ fontFamily: 'var(--font-heading)', fontWeight: 400, margin: 0,
              fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', lineHeight: 1, color: 'rgba(255,255,255,0.88)', marginBottom: 30 }}>
            Timeless by design.
          </TextEffect>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: 'rgba(255,255,255,0.85)', maxWidth: 480,
            marginBottom: 36, animation: 'ga-appear-up 0.6s ease 0.85s both' }}>
            {body}</p>
          <div className="mobile-stack" style={{ gap: 14, animation: 'ga-appear-up 0.5s ease 1.0s both' }}>
            <Button variant="primary" size="lg" as="a" href={active?.href || '/collection'}
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
