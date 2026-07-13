'use client';
import Image from 'next/image';
import Button from '../core/Button';
import RevealBlock from '../motion/RevealBlock';
import { Carousel, CarouselContent, CarouselItem, CarouselNavigation, CarouselIndicator } from '../core/carousel';
import { PRODUCTS } from '@/lib/data';

const STORY_IMAGES = [
  { src: '/assets/hero-pattern.jpeg', alt: 'Gemma Azzurro' },
  ...PRODUCTS.slice(0, 4).map((p) => ({ src: p.img, alt: p.name })),
];

export default function BrandStory() {
  return (
    <section style={{ maxWidth: 'var(--page-width)', margin: '0 auto',
      padding: '0 clamp(20px,3vw,40px) 80px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'var(--grid-brand-story)', gap: 'clamp(24px,5vw,80px)',
        alignItems: 'stretch', background: 'var(--color-surface)',
        borderRadius: 'var(--border-radius)', overflow: 'hidden', minHeight: 420,
        boxShadow: 'var(--shadow-raised)' }}>
        <RevealBlock style={{ order: 'var(--brand-order-text)' as any, padding: 'clamp(36px,5vw,72px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'var(--font-wordmark)', fontSize: 11, letterSpacing: '0.2em',
            textTransform: 'uppercase', color: 'var(--color-brand)', display: 'block', marginBottom: 14 }}>
            Los Angeles · Cairo</span>
          <h2 style={{ margin: '0 0 18px', fontWeight: 500, fontSize: 'var(--text-3xl)', lineHeight: 1.05 }}>
            From a silver atelier in LA to Egypt&apos;s first lab-diamond house.</h2>
          <p style={{ margin: '0 0 18px', fontSize: 16, lineHeight: 1.7, color: 'var(--color-foreground-subtle)' }}>
            We began with sterling silver and gold in Los Angeles. Today Gemma Azzurro is the pioneering
            destination for lab diamonds in Egypt — transparent, exceptional, and made to last.</p>
          <p style={{ margin: '0 0 28px', fontSize: 14, lineHeight: 1.6, color: 'var(--color-foreground-muted)' }}>
            Explore our models wearing Gemma Azzurro →</p>
          <div>
            <Button variant="secondary" as="a" href="/collection">Our Story</Button>
          </div>
        </RevealBlock>
        <Carousel
          className="ga-brand-carousel"
          style={{ order: 'var(--brand-order-img)' as any, minHeight: 380 }}
        >
          <CarouselContent style={{ height: '100%' }}>
            {STORY_IMAGES.map((img, i) => (
              <CarouselItem key={i} style={{ position: 'relative' }}>
                <Image src={img.src} alt={img.alt} fill sizes="(max-width: 1024px) 100vw, 50vw"
                  style={{ objectFit: 'cover' }} priority={i === 0} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselNavigation
            style={{ position: 'absolute', bottom: 20, right: 20, zIndex: 2 }}
            alwaysShow
          />
          <CarouselIndicator style={{ position: 'absolute', bottom: 26, left: 20, zIndex: 2 }} />
        </Carousel>
      </div>
    </section>
  );
}
