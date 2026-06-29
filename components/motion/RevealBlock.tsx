'use client';
import { useEffect, useRef, ReactNode, CSSProperties } from 'react';

export default function RevealBlock({ children, delay = 0, style }: {
  children: ReactNode; delay?: number; style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.style.animation = `ga-appear-up 0.4s ease ${delay}s both`;
        el.style.opacity = '1';
        obs.unobserve(el);
      }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return <div ref={ref} style={{ opacity: 0, ...style }}>{children}</div>;
}
