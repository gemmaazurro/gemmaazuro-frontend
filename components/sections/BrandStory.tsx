'use client';
import Link from 'next/link';
import Button from '../core/Button';
import RevealBlock from '../motion/RevealBlock';

export default function BrandStory() {
  return (
    <section style={{ maxWidth: 'var(--page-width)', margin: '0 auto',
      padding: '0 clamp(20px,3vw,40px) 80px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(24px,5vw,80px)',
        alignItems: 'stretch', background: 'var(--color-surface)',
        borderRadius: 'var(--border-radius)', overflow: 'hidden', minHeight: 420 }}>
        <RevealBlock style={{ padding: 'clamp(36px,5vw,72px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'var(--font-wordmark)', fontSize: 11, letterSpacing: '0.2em',
            textTransform: 'uppercase', color: 'var(--color-brand)', display: 'block', marginBottom: 14 }}>
            Los Angeles · Cairo</span>
          <h2 style={{ margin: '0 0 18px', fontWeight: 500, fontSize: 'var(--text-3xl)', lineHeight: 1.05 }}>
            From a silver atelier in LA to Egypt's first lab-diamond house.</h2>
          <p style={{ margin: '0 0 28px', fontSize: 16, lineHeight: 1.7, color: 'var(--color-foreground-subtle)' }}>
            We began with sterling silver and gold in Los Angeles. Today Gemma Azzurro is the pioneering
            destination for IGI-certified lab diamonds in Egypt — transparent, exceptional, and made to last.</p>
          <div>
            <Link href="/collection">
              <Button variant="secondary">Our Story</Button>
            </Link>
          </div>
        </RevealBlock>
        <div style={{
          backgroundImage: "url('/assets/hero-pattern.jpeg')",
          backgroundSize: 'cover', backgroundPosition: 'center', minHeight: 380,
        }} />
      </div>
    </section>
  );
}
