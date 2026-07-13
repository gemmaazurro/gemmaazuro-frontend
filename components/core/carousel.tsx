'use client';
import React, {
  createContext, useContext, useEffect, useState,
  ReactNode,
} from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from './Icons';

/**
 * Carousel, API-shaped after motion-primitives' Carousel
 * (https://motion-primitives.com/docs/carousel) — Root/Content/Item/Navigation/Indicator.
 * Uses embla-carousel-react underneath (the same engine motion-primitives' own carousel
 * wraps) for real touch/mouse drag with momentum — a hand-rolled drag reimplementation
 * isn't worth the risk of feeling subtly different from the real thing.
 */
interface CarouselCtx {
  selectedIndex: number;
  scrollTo: (i: number) => void;
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  count: number;
  emblaRef: ReturnType<typeof useEmblaCarousel>[0];
}
const CarouselContext = createContext<CarouselCtx | null>(null);
const useCarousel = () => {
  const ctx = useContext(CarouselContext);
  if (!ctx) throw new Error('Carousel.* must be rendered inside <Carousel>');
  return ctx;
};

export function Carousel({ children, index, onIndexChange, className, style, ...rest }: {
  children: ReactNode;
  index?: number;
  onIndexChange?: (i: number) => void;
  className?: string;
  style?: React.CSSProperties;
} & React.HTMLAttributes<HTMLDivElement>) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      const i = emblaApi.selectedScrollSnap();
      setSelectedIndex(i);
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
      onIndexChange?.(i);
    };
    setCount(emblaApi.scrollSnapList().length);
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => { emblaApi.off('select', onSelect); emblaApi.off('reInit', onSelect); };
  }, [emblaApi, onIndexChange]);

  useEffect(() => {
    if (emblaApi && index !== undefined) emblaApi.scrollTo(index);
  }, [emblaApi, index]);

  return (
    <CarouselContext.Provider value={{
      selectedIndex,
      scrollTo: (i) => emblaApi?.scrollTo(i),
      scrollPrev: () => emblaApi?.scrollPrev(),
      scrollNext: () => emblaApi?.scrollNext(),
      canScrollPrev, canScrollNext, count, emblaRef,
    }}>
      <div className={className} style={{ position: 'relative', overflow: 'hidden', ...style }} {...rest}>
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

export function CarouselContent({ children, className, style }: {
  children: ReactNode; className?: string; style?: React.CSSProperties;
}) {
  const { emblaRef } = useCarousel();
  return (
    <div ref={emblaRef} style={{ overflow: 'hidden', width: '100%', height: '100%' }}>
      <div className={className} style={{ display: 'flex', height: '100%', ...style }}>
        {children}
      </div>
    </div>
  );
}

export function CarouselItem({ children, className, style }: {
  children: ReactNode; className?: string; style?: React.CSSProperties;
}) {
  return (
    <div className={className} style={{ flex: '0 0 100%', minWidth: 0, height: '100%', ...style }}>
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
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } = useCarousel();
  return (
    <div className={className} style={{ display: 'flex', gap: 8, ...style }}>
      <button
        type="button"
        aria-label="Previous slide"
        className={classNameButton}
        onClick={scrollPrev}
        style={navButtonStyle(alwaysShow || canScrollPrev)}
      >
        <ChevronLeft size={18} />
      </button>
      <button
        type="button"
        aria-label="Next slide"
        className={classNameButton}
        onClick={scrollNext}
        style={navButtonStyle(alwaysShow || canScrollNext)}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}

export function CarouselIndicator({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const { selectedIndex, scrollTo, count } = useCarousel();
  return (
    <div className={className} style={{ display: 'flex', gap: 6, ...style }}>
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`Go to slide ${i + 1}`}
          onClick={() => scrollTo(i)}
          style={{
            width: i === selectedIndex ? 18 : 6, height: 6, borderRadius: 9999,
            border: 'none', padding: 0, cursor: 'pointer',
            background: i === selectedIndex ? '#fff' : 'rgba(255,255,255,0.7)',
            // Inverts against whatever's behind it (light or dark image) instead of
            // relying on a fixed white — guarantees contrast on every slide.
            mixBlendMode: 'difference',
            transition: 'width 0.25s ease, background 0.25s ease',
          }}
        />
      ))}
    </div>
  );
}
