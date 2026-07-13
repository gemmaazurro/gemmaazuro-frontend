'use client';
import { useEffect, useState } from 'react';
import { ReactLenis } from 'lenis/react';

/**
 * Smooth scroll, desktop only — disabled on touch/mobile viewports (native momentum
 * scrolling there is already good, and Lenis can fight touch gestures) and disabled
 * entirely under prefers-reduced-motion.
 */
export function LenisProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setEnabled(desktopQuery.matches && !reducedMotionQuery.matches);
    update();
    desktopQuery.addEventListener('change', update);
    reducedMotionQuery.addEventListener('change', update);
    return () => {
      desktopQuery.removeEventListener('change', update);
      reducedMotionQuery.removeEventListener('change', update);
    };
  }, []);

  if (!enabled) return <>{children}</>;

  return (
    <ReactLenis root options={{ duration: 1.1, smoothWheel: true, syncTouch: false }}>
      {children}
    </ReactLenis>
  );
}
