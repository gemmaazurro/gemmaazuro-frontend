import { ReactNode, CSSProperties } from 'react';

const variants: Record<string, CSSProperties> = {
  default: { background: 'var(--color-surface)', color: 'var(--color-foreground-muted)' },
  igi: { background: 'var(--color-igi-bg)', color: 'var(--color-igi)', border: '1px solid rgba(15,107,53,0.2)' },
  brand: { background: 'var(--color-brand-light)', color: 'var(--color-brand)' },
};

export default function Badge({ children, variant = 'default', style }: {
  children: ReactNode; variant?: 'default' | 'igi' | 'brand'; style?: CSSProperties;
}) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '4px 10px', borderRadius: 'var(--rounded-full)',
      fontSize: 11, fontWeight: 500, letterSpacing: '0.02em', lineHeight: 1,
      ...variants[variant], ...style,
    }}>{children}</span>
  );
}
