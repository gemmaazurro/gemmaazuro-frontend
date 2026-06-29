'use client';
import { ReactNode, CSSProperties } from 'react';

export default function Marquee({ items, gap = 64, speed = 40, style }: {
  items: ReactNode[]; gap?: number; speed?: number; style?: CSSProperties;
}) {
  const duration = Math.max(10, items.length * (gap / speed) * 4);
  const inner = [...items, ...items];
  return (
    <div style={{ overflow: 'hidden', ...style }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap, width: 'max-content',
        animation: `ga-scroll-left ${duration}s linear infinite`,
      }}>
        {inner.map((item, i) => (
          <span key={i} style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center' }}>{item}</span>
        ))}
      </div>
    </div>
  );
}
