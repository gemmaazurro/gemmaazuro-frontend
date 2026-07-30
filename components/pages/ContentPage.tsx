import type { ReactNode } from 'react';
import RevealBlock from '@/components/motion/RevealBlock';

/**
 * Shared frame for the editor-authored pages (FAQ, About, Policies, …).
 *
 * They all want the same thing: an eyebrow, a title, and a readable column.
 * Keeping it here means the seven pages stay visually identical and none of
 * them re-invents the spacing.
 */
export default function ContentPage({
  eyebrow,
  title,
  intro,
  children,
  wide = false,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  children: ReactNode;
  /** Branches and blog need the full width; prose reads better narrow. */
  wide?: boolean;
}) {
  return (
    <div style={{
      maxWidth: 'var(--page-width)', margin: '0 auto',
      padding: '48px clamp(20px,3vw,40px) 88px', minHeight: '60vh',
    }}>
      <div style={{ maxWidth: wide ? '100%' : 760 }}>
        <RevealBlock>
          <span style={{
            fontFamily: 'var(--font-wordmark)', fontSize: 11, letterSpacing: '0.2em',
            textTransform: 'uppercase', color: 'var(--color-brand)',
            display: 'block', marginBottom: 12,
          }}>{eyebrow}</span>
          <h1 style={{
            margin: '0 0 20px', fontFamily: 'var(--font-heading)', fontWeight: 500,
            fontSize: 'clamp(2rem,4vw,2.8rem)', lineHeight: 1.05, textWrap: 'balance',
          }}>{title}</h1>
          {intro && (
            <p style={{
              margin: '0 0 40px', fontSize: 16, lineHeight: 1.7,
              color: 'var(--color-foreground-muted)', maxWidth: 620,
            }}>{intro}</p>
          )}
        </RevealBlock>

        <RevealBlock delay={0.1}>{children}</RevealBlock>
      </div>
    </div>
  );
}

/**
 * Renders rich text authored in the dashboard's CKEditor.
 *
 * This is `dangerouslySetInnerHTML` on purpose: the source is the CMS, which
 * only staff (IsNotCustomer) can write to, and the whole point of a rich-text
 * field is that its markup survives. Never point this at anything a shopper
 * can submit.
 */
export function RichText({ html }: { html: string }) {
  return (
    <>
      <style>{`
        .ga-rich-text { font-size: 15px; line-height: 1.8; color: var(--color-foreground); }
        .ga-rich-text > *:first-child { margin-top: 0; }
        .ga-rich-text > *:last-child { margin-bottom: 0; }
        .ga-rich-text h1, .ga-rich-text h2, .ga-rich-text h3, .ga-rich-text h4 {
          font-family: var(--font-heading); font-weight: 500; line-height: 1.25;
          margin: 36px 0 12px;
        }
        .ga-rich-text h1 { font-size: 1.6rem; }
        .ga-rich-text h2 { font-size: 1.35rem; }
        .ga-rich-text h3 { font-size: 1.15rem; }
        .ga-rich-text p, .ga-rich-text ul, .ga-rich-text ol { margin: 0 0 16px; }
        .ga-rich-text ul, .ga-rich-text ol { padding-inline-start: 22px; }
        .ga-rich-text li { margin-bottom: 8px; }
        .ga-rich-text a { color: var(--color-brand); text-decoration: underline; }
        .ga-rich-text img { max-width: 100%; height: auto; border-radius: var(--rounded-block); }
        .ga-rich-text strong { font-weight: 600; }
        .ga-rich-text hr { border: none; border-top: 1px solid var(--color-border); margin: 32px 0; }
        .ga-rich-text blockquote {
          margin: 24px 0; padding-inline-start: 18px;
          border-inline-start: 2px solid var(--color-brand);
          color: var(--color-foreground-muted);
        }
        /* Wide content must scroll inside itself, never the page. */
        .ga-rich-text table { display: block; overflow-x: auto; max-width: 100%; border-collapse: collapse; }
        .ga-rich-text th, .ga-rich-text td {
          border: 1px solid var(--color-border); padding: 10px 14px; text-align: start;
        }
      `}</style>
      <div
        className="ga-rich-text"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
}

/** Shown when an editor has not created the row yet. */
export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <p style={{
      margin: 0, padding: '32px 0', fontSize: 15, lineHeight: 1.7,
      color: 'var(--color-foreground-muted)',
    }}>{children}</p>
  );
}
