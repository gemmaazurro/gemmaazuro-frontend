'use client';
import React, {
  createContext, useContext, useEffect, useRef, useState,
  ReactNode, Children,
} from 'react';
import { motion, useMotionValue, animate } from 'motion/react';
import { ChevronLeft, ChevronRight } from './Icons';

/**
 * Drag-to-swipe carousel, API-compatible with motion-primitives' Carousel
 * (https://motion-primitives.com/docs/carousel) — Root/Content/Item/Navigation/Indicator.
 * Built on `motion`'s drag (already a dependency, see infinite-slider.tsx) instead of
 * pulling in embla-carousel-react, since this project has no Tailwind-utility/shadcn setup
 * to hang the original's classNames off of — styling goes through our own design tokens.
 */
interface CarouselCtx {
  index: number;
  setIndex: (i: number) => void;
  count: number;
  registerCount: (n: number) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}
const CarouselContext = createContext<CarouselCtx | null>(null);
const useCarousel = () => {
  const ctx = useContext(CarouselContext);
  if (!ctx) throw new Error('Carousel.* must be rendered inside <Carousel>');
  return ctx;
};

export function Carousel({ children, index: controlledIndex, onIndexChange, className, style, ...rest }: {
  children: ReactNode;
  index?: number;
  onIndexChange?: (i: number) => void;
  className?: string;
  style?: React.CSSProperties;
} & React.HTMLAttributes<HTMLDivElement>) {
  const [uncontrolledIndex, setUncontrolledIndex] = useState(0);
  const index = controlledIndex ?? uncontrolledIndex;
  const setIndex = (i: number) => { setUncontrolledIndex(i); onIndexChange?.(i); };
  const [count, setCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <CarouselContext.Provider value={{ index, setIndex, count, registerCount: setCount, containerRef }}>
      <div ref={containerRef} className={className} style={{ position: 'relative', overflow: 'hidden', ...style }} {...rest}>
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

export function CarouselContent({ children, className, style }: {
  children: ReactNode; className?: string; style?: React.CSSProperties;
}) {
  const { index, setIndex, containerRef, registerCount } = useCarousel();
  const items = Children.toArray(children);
  const [width, setWidth] = useState(0);
  const x = useMotionValue(0);

  useEffect(() => { registerCount(items.length); }, [items.length, registerCount]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => setWidth(el.offsetWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [containerRef]);

  useEffect(() => {
    const controls = animate(x, -index * width, { type: 'spring', stiffness: 300, damping: 32 });
    return () => controls.stop();
  }, [index, width, x]);

  return (
    <motion.div
      className={className}
      style={{ display: 'flex', width: '100%', height: '100%', cursor: items.length > 1 ? 'grab' : 'default', x, ...style }}
      drag={items.length > 1 ? 'x' : false}
      dragConstraints={{ left: -width * Math.max(items.length - 1, 0), right: 0 }}
      dragElastic={0.08}
      whileDrag={{ cursor: 'grabbing' }}
      onDragEnd={(_, info) => {
        const threshold = width * 0.2;
        let next = index;
        if (info.offset.x < -threshold) next = Math.min(index + 1, items.length - 1);
        else if (info.offset.x > threshold) next = Math.max(index - 1, 0);
        setIndex(next);
      }}
    >
      {children}
    </motion.div>
  );
}

export function CarouselItem({ children, className, style }: {
  children: ReactNode; className?: string; style?: React.CSSProperties;
}) {
  return (
    <div className={className} style={{ flex: '0 0 100%', width: '100%', height: '100%', ...style }}>
      {children}
    </div>
  );
}

const navButtonStyle = (visible: boolean): React.CSSProperties => ({
  width: 40, height: 40, borderRadius: '50%', border: 'none',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: 'rgba(0,0,0,0.55)', color: '#fff', cursor: visible ? 'pointer' : 'default',
  opacity: visible ? 1 : 0.35, pointerEvents: visible ? 'auto' : 'none',
  transition: 'opacity 0.2s ease, transform 0.15s ease',
  WebkitTapHighlightColor: 'transparent',
});

export function CarouselNavigation({ className, classNameButton, alwaysShow, style }: {
  className?: string; classNameButton?: string; alwaysShow?: boolean; style?: React.CSSProperties;
}) {
  const { index, setIndex, count } = useCarousel();
  const atStart = index === 0;
  const atEnd = index >= count - 1;

  return (
    <div className={className} style={{ display: 'flex', gap: 8, ...style }}>
      <button
        type="button"
        aria-label="Previous slide"
        className={classNameButton}
        onClick={() => setIndex(Math.max(index - 1, 0))}
        style={navButtonStyle(alwaysShow || !atStart)}
      >
        <ChevronLeft size={18} />
      </button>
      <button
        type="button"
        aria-label="Next slide"
        className={classNameButton}
        onClick={() => setIndex(Math.min(index + 1, count - 1))}
        style={navButtonStyle(alwaysShow || !atEnd)}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}

export function CarouselIndicator({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const { index, setIndex, count } = useCarousel();
  return (
    <div className={className} style={{ display: 'flex', gap: 6, ...style }}>
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`Go to slide ${i + 1}`}
          onClick={() => setIndex(i)}
          style={{
            width: i === index ? 18 : 6, height: 6, borderRadius: 9999,
            border: 'none', padding: 0, cursor: 'pointer',
            background: i === index ? '#fff' : 'rgba(255,255,255,0.5)',
            transition: 'width 0.25s ease, background 0.25s ease',
          }}
        />
      ))}
    </div>
  );
}
