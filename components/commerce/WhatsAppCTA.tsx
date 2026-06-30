'use client';
import React, { useRef } from 'react';
import { WhatsApp } from '@/components/core/Icons';
import { WA_PHONE } from '@/lib/data';

/** WhatsApp CTA with signature fill-wipe hover (white blob rises from bottom). */
interface WhatsAppCTAProps {
  phone?: string;
  message?: string;
  label?: string;
  fullWidth?: boolean;
  style?: React.CSSProperties;
}

export default function WhatsAppCTA({
  phone = WA_PHONE,
  message = "Hi Gemma Azzurro, I'd like to customize a piece.",
  label = 'Customize via WhatsApp',
  fullWidth = true,
  style,
}: WhatsAppCTAProps) {
  const href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  const WA = '#25D366';
  const fillRef = useRef<HTMLSpanElement>(null);
  const txtRef = useRef<HTMLSpanElement>(null);

  const onEnter = () => {
    if (fillRef.current) fillRef.current.style.transform = 'translate3d(0,0%,0)';
    if (txtRef.current) txtRef.current.style.color = WA;
  };
  const onLeave = () => {
    if (fillRef.current) fillRef.current.style.transform = 'translate3d(0,76%,0)';
    if (txtRef.current) txtRef.current.style.color = '#fff';
  };

  return (
    <a
      href={href} target="_blank" rel="noopener noreferrer"
      onMouseEnter={onEnter} onMouseLeave={onLeave}
      style={{
        position: 'relative', overflow: 'hidden',
        display: fullWidth ? 'flex' : 'inline-flex',
        width: fullWidth ? '100%' : undefined,
        boxSizing: 'border-box',
        alignItems: 'center', justifyContent: 'center', gap: '0.625rem',
        padding: '0.875rem 1.875rem',
        borderRadius: 'var(--rounded-button)',
        background: WA, textDecoration: 'none',
        ...style,
      }}>
      {/* Fill blob — bottom-to-top wipe */}
      <span ref={fillRef} aria-hidden style={{
        display: 'block', position: 'absolute',
        width: '150%', height: '200%',
        insetBlockStart: '-50%', insetInlineStart: '-25%',
        borderRadius: '50%', background: '#fff',
        transform: 'translate3d(0,76%,0)',
        transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)',
        pointerEvents: 'none',
      }} />

      {/* Inner text */}
      <span ref={txtRef} style={{
        position: 'relative', zIndex: 1,
        display: 'inline-flex', alignItems: 'center', gap: '0.625rem',
        color: '#fff', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '1rem',
        transition: 'color 0.3s ease 0.08s',
      }}>
        <WhatsApp size={20} />
        {label}
      </span>
    </a>
  );
}
