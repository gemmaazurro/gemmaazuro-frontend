'use client';
import Image from 'next/image';
import Button from '../core/Button';
import RevealBlock from '../motion/RevealBlock';
import { Carousel, CarouselContent, CarouselItem, CarouselNavigation, CarouselIndicator } from '../core/carousel';
import type { Slide } from '@/lib/api/cms';

/** Shown only until the dashboard has a carousel slide, so the panel is never blank. */
const FALLBACK_HEADING = 'From a silver atelier in LA to Egypt’s first lab-diamond house.';
const FALLBACK_BODY = [
  'We began with sterling silver and gold in Los Angeles. Today Gemma Azzurro is the pioneering '
    + 'destination for lab diamonds in Egypt — transparent, exceptional, and made to last.',
  'Explore our models wearing Gemma Azzurro →',
];

interface BrandStoryProps {
  /**
   * Dashboard-managed slides (Hero rows with placement="carousel").
   *
   * The first slide does double duty: its photo opens the carousel and its
   * title/description/link fill the copy panel beside it. Nothing here is
   * shipped in the repo — an empty dashboard means no photos at all.
   */
  slides?: Slide[];
}

export default function BrandStory({ slides = [] }: BrandStoryProps) {
  const lead = slides[0];

  const heading = lead?.title?.trim() || FALLBACK_HEADING;
  // A blank line in the dashboard textarea starts a new paragraph — that is how
  // an editor gets the muted follow-up line under the main copy.
  const paragraphs = lead?.description?.trim()
    ? lead.description.trim().split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
    : FALLBACK_BODY;
  const [body, ...notes] = paragraphs;

  return (
    <section style={{ maxWidth: 'var(--page-width)', margin: '0 auto',
      padding: '0 clamp(20px,3vw,40px) var(--section-pad-y)' }}>
      <div style={{ display: 'grid',
        // With no uploaded photos there is no second column to balance against,
        // so the copy panel takes the full width instead of leaving a gap.
        gridTemplateColumns: slides.length > 0 ? 'var(--grid-brand-story)' : '1fr',
        gap: 'clamp(24px,5vw,80px)',
        alignItems: 'stretch', background: 'var(--color-surface)',
        borderRadius: 'var(--border-radius)', overflow: 'hidden', minHeight: 420,
        boxShadow: 'var(--shadow-raised)' }}>
        <RevealBlock style={{ order: 'var(--brand-order-text)' as any, padding: 'clamp(36px,5vw,72px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'var(--font-wordmark)', fontSize: 11, letterSpacing: '0.2em',
            textTransform: 'uppercase', color: 'var(--color-brand)', display: 'block', marginBottom: 14 }}>
            Los Angeles · Cairo</span>
          <h2 style={{ margin: '0 0 18px', fontWeight: 500, fontSize: 'var(--text-3xl)', lineHeight: 1.05 }}>
            {heading}</h2>
          <p style={{ margin: '0 0 18px', fontSize: 16, lineHeight: 1.7, color: 'var(--color-foreground-subtle)' }}>
            {body}</p>
          {notes.map((note, i) => (
            <p key={i} style={{ margin: '0 0 18px', fontSize: 14, lineHeight: 1.6, color: 'var(--color-foreground-muted)' }}>
              {note}</p>
          ))}
          <div style={{ marginTop: 10 }}>
            <Button variant="secondary" as="a" href={lead?.href || '/collection'}>Our Story</Button>
          </div>
        </RevealBlock>
        {slides.length > 0 && (
          <Carousel
            className="ga-brand-carousel"
            style={{ order: 'var(--brand-order-img)' as any, minHeight: 380 }}
          >
            <CarouselContent style={{ height: '100%' }}>
              {slides.map((slide, i) => (
                <CarouselItem key={slide.id} style={{ position: 'relative' }}>
                  {slide.isVideo ? (
                    // Hero.file accepts any upload, so a carousel slide may be footage.
                    <video src={slide.src} autoPlay muted loop playsInline
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <Image src={slide.src} alt={slide.alt} fill sizes="(max-width: 1024px) 100vw, 50vw"
                      style={{ objectFit: 'cover' }} priority={i === 0} />
                  )}
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselNavigation
              style={{ position: 'absolute', bottom: 20, right: 20, zIndex: 2 }}
              alwaysShow
            />
            <CarouselIndicator style={{ position: 'absolute', bottom: 26, left: 20, zIndex: 2 }} />
          </Carousel>
        )}
      </div>
    </section>
  );
}
