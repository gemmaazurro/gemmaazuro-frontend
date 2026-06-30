'use client';
import { useEffect, useRef } from 'react';

/**
 * CustomCursor — expanding circle with label text.
 * Expands to 52px on [data-cursor] elements, shows label.
 */
const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer:fine)').matches || prefersReduced()) return;

    const el = ref.current;
    if (!el) return;

    let raf: number;
    const move = (e: MouseEvent) => {
      raf = requestAnimationFrame(() => {
        el.style.left = e.clientX + 'px';
        el.style.top = e.clientY + 'px';
      });
    };

    const enter = (e: MouseEvent) => {
      const t = (e.target as HTMLElement).closest('[data-cursor]');
      if (!t) return;
      const label = (t as HTMLElement).dataset.cursor;
      el.style.width = '52px';
      el.style.height = '52px';
      el.style.opacity = '1';
      if (labelRef.current && label) labelRef.current.textContent = label;
    };

    const leave = () => {
      el.style.width = '0';
      el.style.height = '0';
      el.style.opacity = '0';
    };

    window.addEventListener('mousemove', move);
    document.addEventListener('mouseenter', enter, true);
    document.addEventListener('mouseleave', leave, true);

    return () => {
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseenter', enter);
      document.removeEventListener('mouseleave', leave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden className="ga-cursor">
      <span ref={labelRef} style={{
        color: '#fff', fontSize: 10, fontFamily: 'var(--font-body)',
        fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase'
      }} />
    </div>
  );
}
