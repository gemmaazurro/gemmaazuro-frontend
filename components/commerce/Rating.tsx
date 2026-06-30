'use client';
import React, { useEffect, useState } from 'react';

/** Animated star rating — stars pop in one-by-one, count ticks up. */
interface RatingProps {
  /** 0–5, supports fractional fill. */
  value?: number;
  /** Review count; shown alongside if provided. */
  count?: number;
  size?: number;
  /** Enable entrance animation (default true). */
  animate?: boolean;
  style?: React.CSSProperties;
}

export default function Rating({ value = 0, count, size = 16, animate = true, style }: RatingProps) {
  const [shown, setShown] = useState(!animate);
  const [displayVal, setDisplayVal] = useState(animate ? 0 : value);
  const [displayCount, setDisplayCount] = useState(animate ? 0 : (count ?? 0));

  useEffect(() => {
    if (!animate) return;
    const t = setTimeout(() => {
      setShown(true);
      // Count-up animation
      if (count != null) {
        const start = Date.now();
        const dur = 900;
        const tick = () => {
          const p = Math.min(1, (Date.now() - start) / dur);
          const ease = 1 - Math.pow(1 - p, 3); // ease-out cubic
          setDisplayVal(parseFloat((ease * value).toFixed(1)));
          setDisplayCount(Math.round(ease * count));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, 120);
    return () => clearTimeout(t);
  }, [animate, value, count]);

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', ...style }}>
      <div style={{ display: 'inline-flex', gap: '0.15rem' }}
        aria-label={`${value} out of 5 stars`}>
        {[0, 1, 2, 3, 4].map((i) => {
          const fill = Math.max(0, Math.min(1, value - i));
          return (
            <span key={i} style={{
              display: 'inline-block',
              opacity: shown ? 1 : 0,
              transform: shown ? 'scale(1)' : 'scale(0.4)',
              transition: `opacity 0.32s ease ${i * 0.075}s, transform 0.38s cubic-bezier(0.075,0.82,0.165,1) ${i * 0.075}s`,
            }}>
              <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
                <defs>
                  <linearGradient id={`ga-star-${i}-${String(value).replace('.', '')}`} x1="0" x2="1" y1="0" y2="0">
                    <stop offset={`${fill * 100}%`} stopColor="var(--color-rating, #F0A500)" />
                    <stop offset={`${fill * 100}%`} stopColor="var(--color-border)" />
                  </linearGradient>
                </defs>
                <path
                  d="M12 2l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.8 6.1 20.8l1.2-6.6L2.5 9.6l6.6-.9L12 2z"
                  fill={`url(#ga-star-${i}-${String(value).replace('.', '')})`}
                />
              </svg>
            </span>
          );
        })}
      </div>

      {count != null && (
        <span style={{
          fontFamily: 'var(--font-body)', fontSize: '0.8125rem',
          color: 'var(--color-foreground-muted)',
          opacity: shown ? 1 : 0,
          transition: 'opacity 0.4s ease 0.42s',
        }}>
          {animate ? displayVal.toFixed(1) : value.toFixed(1)}&nbsp;
          ({animate ? displayCount : count})
        </span>
      )}
    </div>
  );
}
