'use client';
import { ReactNode, CSSProperties } from 'react';

/** Marquee — continuous horizontal scroll. */
interface MarqueeProps {
  items?: ReactNode[];
  gap?: number;
  speed?: number;
  style?: CSSProperties;
}

const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function Marquee({ items = [], gap = 64, speed = 38, style }: MarqueeProps) {
  const doubled = [...items, ...items];
  const dur = `${speed}s`;

  return (
    <div style={{ overflow: 'hidden', position: 'relative', ...style }}>
      <div style={{
        display: 'flex', gap, width: 'max-content',
        animation: prefersReduced() ? 'none' : `ga-scroll-left ${dur} linear infinite`,
      }}>
        {doubled.map((item, i) => (
          <span key={i} style={{ whiteSpace: 'nowrap', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 10 }}>{item}</span>
        ))}
      </div>
    </div>
  );
}
