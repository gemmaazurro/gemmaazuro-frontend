'use client';
import { useEffect, useRef, useState } from 'react';

export default function Rating({ value, count }: { value: number; count: number }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ display: 'flex', gap: 2 }}>
        {[1,2,3,4,5].map(i => (
          <span key={i} style={{
            color: i <= Math.round(value) ? 'var(--color-rating)' : 'var(--color-border-dark)',
            fontSize: 18,
            animation: visible ? `ga-scale-in 0.4s var(--ease-spring) ${i * 0.07}s both` : 'none',
          }}>★</span>
        ))}
      </div>
      <span style={{ fontSize: 13, color: 'var(--color-foreground-muted)' }}>{value} ({count} reviews)</span>
    </div>
  );
}
