'use client';
import React, { useRef, ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react';

/**
 * Gemma Azzurro primary button. Signature pill shape with a circular
 * fill-wipe on hover (white over blue for primary; blue over white for secondary).
 */
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'whatsapp' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  as?: 'button' | 'a';
  href?: string;
  icon?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  children?: ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  as = 'button',
  href,
  icon,
  iconRight,
  fullWidth = false,
  disabled = false,
  children,
  style,
  ...rest
}: ButtonProps & (ButtonHTMLAttributes<HTMLButtonElement> | AnchorHTMLAttributes<HTMLAnchorElement>)) {
  const pads = {
    sm: '0.625rem 1.25rem',
    md: '0.875rem 1.875rem',
    lg: '1.125rem 2.25rem',
  };
  const fontSizes = { sm: '0.875rem', md: '1rem', lg: '1.125rem' };

  const palettes = {
    primary:   { bg: 'var(--color-brand)', fg: '#fff', border: 'transparent', fill: '#fff', fillFg: 'var(--color-brand)' },
    secondary: { bg: 'transparent', fg: 'var(--color-foreground)', border: 'var(--color-foreground)', fill: 'var(--color-foreground)', fillFg: '#fff' },
    whatsapp:  { bg: 'var(--color-whatsapp)', fg: '#fff', border: 'transparent', fill: '#fff', fillFg: 'var(--color-whatsapp)' },
    ghost:     { bg: 'transparent', fg: 'var(--color-brand)', border: 'transparent', fill: 'var(--color-brand-light)', fillFg: 'var(--color-brand)' },
  };
  const p = palettes[variant] || palettes.primary;

  const base: React.CSSProperties = {
    position: 'relative',
    display: fullWidth ? 'flex' : 'inline-flex',
    width: fullWidth ? '100%' : undefined,
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.625rem',
    padding: pads[size],
    fontFamily: 'var(--font-body)',
    fontWeight: 500,
    fontSize: fontSizes[size],
    lineHeight: 1,
    letterSpacing: '0',
    color: p.fg,
    background: p.bg,
    border: `var(--border-width-button) solid ${p.border}`,
    borderRadius: 'var(--rounded-button)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    overflow: 'hidden',
    textDecoration: 'none',
    transition: 'box-shadow 0.3s ease, opacity 0.2s ease, transform 0.1s ease',
    WebkitTapHighlightColor: 'transparent',
    ...style,
  };

  const fillRef = useRef<HTMLSpanElement>(null);
  const txtRef = useRef<HTMLSpanElement>(null);

  const onEnter = () => {
    if (disabled || !fillRef.current) return;
    fillRef.current.style.transform = 'translate3d(0,0%,0)';
    if (txtRef.current) txtRef.current.style.color = p.fillFg;
  };
  const onLeave = () => {
    if (!fillRef.current) return;
    fillRef.current.style.transform = 'translate3d(0,76%,0)';
    if (txtRef.current) txtRef.current.style.color = p.fg;
  };

  const fill = (
    <span ref={fillRef} aria-hidden style={{
      display: 'block', position: 'absolute', width: '150%', height: '200%',
      insetBlockStart: '-50%', insetInlineStart: '-25%', borderRadius: '50%',
      background: p.fill, transform: 'translate3d(0,76%,0)',
      transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)', pointerEvents: 'none',
    }} />
  );

  const inner = (
    <span ref={txtRef} style={{
      position: 'relative', zIndex: 1, display: 'inline-flex',
      alignItems: 'center', gap: '0.625rem', color: p.fg,
      transition: 'color 0.3s ease 0.1s',
    }}>
      {icon}{children}{iconRight}
    </span>
  );

  const commonProps = {
    style: base,
    onMouseEnter: onEnter,
    onMouseLeave: onLeave,
    ...rest
  };

  if (as === 'a') {
    return <a href={href} {...(commonProps as AnchorHTMLAttributes<HTMLAnchorElement>)}>{!disabled && fill}{inner}</a>;
  }
  return (
    <button
      type="button"
      disabled={disabled}
      {...(commonProps as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {!disabled && fill}{inner}
    </button>
  );
}
