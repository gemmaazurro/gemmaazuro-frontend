'use client';
import { useEffect, useRef, ReactNode, CSSProperties, ElementType } from 'react';

/**
 * RevealBlock — transition-based reveal with IntersectionObserver.
 * Supports `as` prop for semantic HTML tags.
 */
interface RevealBlockProps {
  children: ReactNode;
  delay?: number;
  style?: CSSProperties;
  as?: ElementType;
}

const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function RevealBlock({ children, delay = 0, style, as: Tag = 'div' }: RevealBlockProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReduced()) {
      if (ref.current) {
        ref.current.style.opacity = '1';
        ref.current.style.transform = 'translateY(0)';
      }
      return;
    }

    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        obs.unobserve(el);
      }
    }, { threshold: 0.12 });

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      style={{
        opacity: 0,
        transform: 'translateY(1.5rem)',
        transition: prefersReduced() ? 'none' : `opacity 0.55s ease ${delay}s, transform 0.55s ease ${delay}s`,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
