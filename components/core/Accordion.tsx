'use client';
import React, { useState, ReactNode } from 'react';

/** Animated accordion — CSS grid height reveal + rotating + icon. */
interface AccordionProps {
  title: ReactNode;
  children?: ReactNode;
  defaultOpen?: boolean;
  style?: React.CSSProperties;
}

export default function Accordion({ title, children, defaultOpen = false, style }: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div style={{ borderTop: '1px solid var(--color-border)', ...style }}>
      <button
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: 12,
          background: 'transparent', border: 'none', cursor: 'pointer',
          padding: '1.125rem 0', textAlign: 'left',
          fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 500,
          color: 'var(--color-foreground)',
        }}>
        <span style={{ flex: 1 }}>{title}</span>
        <span style={{
          flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 20, height: 20,
          transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
          transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          color: open ? 'var(--color-brand)' : 'var(--color-foreground)',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>

      <div style={{
        display: 'grid',
        gridTemplateRows: open ? '1fr' : '0fr',
        transition: 'grid-template-rows 0.38s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        <div style={{ overflow: 'hidden' }}>
          <div style={{
            paddingBottom: '1.25rem',
            fontFamily: 'var(--font-body)', fontSize: '0.9375rem',
            lineHeight: 1.65, color: 'var(--color-foreground-muted)',
          }}>{children}</div>
        </div>
      </div>
    </div>
  );
}
