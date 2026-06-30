import React, { ReactNode, HTMLAttributes } from 'react';

/**
 * Badge — small status pill. The IGI variant is required on every product
 * (certification trust mark) and uses the fixed certification green.
 */
interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'igi' | 'sale' | 'soldout' | 'brand' | 'neutral';
  /** Optional leading icon (igi variant supplies a shield-check automatically). */
  icon?: ReactNode;
  children?: ReactNode;
}

export default function Badge({ variant = 'neutral', icon, children, style, ...rest }: BadgeProps) {
  const palettes = {
    igi:     { bg: 'var(--color-igi-bg)', fg: 'var(--color-igi)' },
    sale:    { bg: 'var(--color-sale-price)', fg: '#fff' },
    soldout: { bg: 'var(--color-foreground)', fg: '#fff' },
    brand:   { bg: 'var(--color-brand-light)', fg: 'var(--color-brand)' },
    neutral: { bg: 'var(--color-surface)', fg: 'var(--color-foreground)' },
  };
  const p = palettes[variant] || palettes.neutral;

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
      padding: '0.25rem 0.625rem', borderRadius: 'var(--rounded-full)',
      background: p.bg, color: p.fg,
      fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 500,
      lineHeight: 1.4, letterSpacing: '0.01em', whiteSpace: 'nowrap',
      ...style,
    }} {...rest}>
      {variant === 'igi' && !icon && (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M12 2l7 3v6c0 4.5-3 8-7 11-4-3-7-6.5-7-11V5l7-3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
          <path d="M8.5 12l2.2 2.2 4.3-4.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
      {icon}
      {children}
    </span>
  );
}
