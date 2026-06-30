'use client';
import { useRef, ReactNode, MouseEvent } from 'react';

/** MagnetEl — magnetic hover effect. */
interface MagnetElProps {
  children: ReactNode;
  strength?: number;
  style?: React.CSSProperties;
}

const prefersReduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function MagnetEl({ children, strength = 0.35, style }: MagnetElProps) {
  const ref = useRef<HTMLSpanElement>(null);

  const onMove = (e: MouseEvent) => {
    if (prefersReduced()) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width / 2) * strength;
    const dy = (e.clientY - r.top - r.height / 2) * strength;
    el.style.transform = `translate(${dx}px, ${dy}px)`;
  };

  const onLeave = () => {
    if (ref.current) ref.current.style.transform = 'translate(0,0)';
  };

  return (
    <span ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ display: 'inline-block', transition: 'transform 0.3s ease', ...style }}>
      {children}
    </span>
  );
}
