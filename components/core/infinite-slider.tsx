'use client';
import { useRef, useState, useEffect, type ReactNode, type CSSProperties } from 'react';
import { motion, useAnimationFrame, useMotionValue } from 'motion/react';

export type InfiniteSliderProps = {
  children: ReactNode;
  gap?: number;
  speed?: number;
  speedOnHover?: number;
  direction?: 'horizontal' | 'vertical';
  reverse?: boolean;
  className?: string;
  style?: CSSProperties;
};

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Continuous marquee, ported from motion-primitives' InfiniteSlider
 * (https://motion-primitives.com/docs/infinite-slider). Unlike a CSS
 * `@keyframes` marquee (which assumes the two duplicated halves are
 * pixel-identical and can visibly jump at the loop seam once async-loaded
 * images shift layout), this measures the real rendered width of one set
 * via ref and advances a single continuous offset with `useAnimationFrame`,
 * wrapping it with modulo — so the loop point is always exact, no glitch.
 */
export function InfiniteSlider({
  children,
  gap = 16,
  speed = 40,
  speedOnHover,
  direction = 'horizontal',
  reverse = false,
  className,
  style,
}: InfiniteSliderProps) {
  const [setWidth, setSetWidth] = useState(0);
  const [setHeight, setSetHeight] = useState(0);
  const [hovering, setHovering] = useState(false);
  const measureRef = useRef<HTMLDivElement>(null);
  const offset = useMotionValue(0);
  const reduced = prefersReduced();

  useEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    const measure = () => {
      setSetWidth(el.scrollWidth);
      setSetHeight(el.scrollHeight);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useAnimationFrame((_, delta) => {
    if (reduced) return;
    const size = direction === 'horizontal' ? setWidth : setHeight;
    if (!size) return;
    const currentSpeed = hovering && speedOnHover !== undefined ? speedOnHover : speed;
    const dir = reverse ? 1 : -1;
    let next = offset.get() + dir * currentSpeed * (delta / 1000);
    // Wrap into [-size, 0) so the jump (if it ever visibly landed on a frame
    // boundary) is imperceptible — content is duplicated 3x below for slack.
    if (next <= -size) next += size;
    if (next > 0) next -= size;
    offset.set(next);
  });

  const axisStyle = direction === 'horizontal'
    ? { x: offset }
    : { y: offset };

  const size = direction === 'horizontal' ? setWidth : setHeight;
  const copies = size > 0 ? 3 : 1;

  return (
    <div
      className={className}
      style={{ overflow: 'hidden', ...style }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <motion.div
        style={{
          display: 'flex',
          flexDirection: direction === 'horizontal' ? 'row' : 'column',
          width: 'max-content',
          gap,
          ...axisStyle,
        }}
      >
        <div ref={measureRef} style={{ display: 'flex', flexDirection: direction === 'horizontal' ? 'row' : 'column', gap }}>
          {children}
        </div>
        {Array.from({ length: copies - 1 }).map((_, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: direction === 'horizontal' ? 'row' : 'column', gap }} aria-hidden>
            {children}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
