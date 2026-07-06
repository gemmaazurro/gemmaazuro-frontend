'use client';
import { useState, useEffect, ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  delay?: number;
}

export default function PageTransition({ children, delay = 0 }: PageTransitionProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div style={{
      opacity: mounted ? 1 : 0,
      transform: mounted ? 'translateY(0)' : 'translateY(1.5rem)',
      transition: 'opacity 0.55s ease-out, transform 0.55s ease-out',
      ...(typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? { transition: 'none', opacity: 1, transform: 'translateY(0)' }
        : {}),
    }}>
      {children}
    </div>
  );
}
