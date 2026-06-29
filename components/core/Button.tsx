'use client';
import { ReactNode, ButtonHTMLAttributes, CSSProperties } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  iconRight?: ReactNode;
  iconLeft?: ReactNode;
}

const sizes: Record<string, CSSProperties> = {
  sm: { height: 38, padding: '0 18px', fontSize: 13 },
  md: { height: 46, padding: '0 24px', fontSize: 14 },
  lg: { height: 54, padding: '0 32px', fontSize: 15 },
};

export default function Button({ variant = 'primary', size = 'md', iconRight, iconLeft, children, style, ...props }: ButtonProps) {
  const s = sizes[size];
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isGhost = variant === 'ghost';
  return (
    <button
      className={`ga-btn${isSecondary ? ' ga-btn-secondary' : ''}${isGhost ? ' ga-btn-ghost' : ''}`}
      style={{
        height: s.height, padding: s.padding, fontSize: s.fontSize,
        gap: 8, border: isSecondary ? '2px solid var(--color-foreground)' : 'none',
        background: isPrimary ? 'var(--color-brand)' : 'transparent',
        color: isPrimary ? '#fff' : 'var(--color-foreground)',
        letterSpacing: '-0.3px', ...style,
      }}
      {...props}
    >
      {iconLeft}{children}{iconRight}
    </button>
  );
}
