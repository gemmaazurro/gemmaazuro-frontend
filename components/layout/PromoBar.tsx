'use client';
import { useState, useEffect } from 'react';

const MESSAGES = [
  'Free insured delivery across Cairo',
  'Customization & engraving via WhatsApp',
];

export default function PromoBar() {
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);
  useEffect(() => {
    const t = setInterval(() => {
      setFade(false);
      setTimeout(() => { setIdx(i => (i + 1) % MESSAGES.length); setFade(true); }, 300);
    }, 3800);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ background: 'var(--color-surface)', color: 'var(--color-foreground)',
      height: 'var(--topbar-height)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 13, letterSpacing: '0.02em', userSelect: 'none' }}>
      <span style={{ opacity: fade ? 1 : 0, transition: 'opacity 0.3s ease' }}>{MESSAGES[idx]}</span>
    </div>
  );
}
