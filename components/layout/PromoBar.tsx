'use client';
import { useState, useEffect } from 'react';

/** Shown until an editor authors announcements with placement="promo". */
const FALLBACK_MESSAGES = [
  'Free insured delivery across Cairo',
  'Customization & engraving via WhatsApp',
];

interface PromoBarProps {
  /** Announcement content for placement="promo", resolved on the server. */
  messages?: string[];
}

export default function PromoBar({ messages }: PromoBarProps) {
  const items = messages?.length ? messages : FALLBACK_MESSAGES;

  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    // A single message has nothing to rotate to.
    if (items.length < 2) return;

    const t = setInterval(() => {
      setFade(false);
      setTimeout(() => { setIdx(i => (i + 1) % items.length); setFade(true); }, 300);
    }, 3800);
    return () => clearInterval(t);
  }, [items.length]);

  // Guard against the list shrinking between renders (editor deactivates a row).
  const message = items[idx] ?? items[0];
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 21,
      background: 'var(--color-surface)', color: 'var(--color-foreground)',
      height: 'var(--topbar-height)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 13, letterSpacing: '0.02em', userSelect: 'none' }}>
      <span style={{ opacity: fade ? 1 : 0, transition: 'opacity 0.3s ease' }}>{message}</span>
    </div>
  );
}
