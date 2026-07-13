'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import Badge from '../core/Badge';

/**
 * Product card — white-background catalogue shot, IGI badge, name, metal/stone,
 * price. Image zooms on hover; heart pulses on wishlist toggle.
 */
interface ProductCardProps {
  image: string;
  imageAlt?: string;
  /** Second image crossfaded on hover (optional). */
  hoverImage?: string;
  name: string;
  /** Metal / stone line, e.g. "18k White Gold · Lab Diamond". */
  meta?: string;
  price: number | string;
  salePrice?: number | string;
  currency?: string;
  /** true → "IGI Certified"; or a custom spec string e.g. "IGI · E/VS1 · 1.02ct". */
  igi?: boolean | string;
  soldOut?: boolean;
  wished?: boolean;
  onWishlist?: () => void;
  onClick?: () => void;
  href?: string;
  style?: React.CSSProperties;
}

export default function ProductCard({
  image, imageAlt, hoverImage, name, meta, price, salePrice,
  igi, soldOut, currency = 'EGP', onWishlist, wished = false, onClick, href, style, ...rest
}: ProductCardProps) {
  const [hover, setHover] = useState(false);
  const [heartPulse, setHeartPulse] = useState(false);
  const [heartHover, setHeartHover] = useState(false);
  const isTouch = typeof window !== 'undefined' && 'ontouchstart' in window;
  const fmt = (n: number | string) => typeof n === 'number' ? n.toLocaleString('en-US') + '\u00a0' + currency : n;

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHeartPulse(true);
    onWishlist?.();
    setTimeout(() => setHeartPulse(false), 380);
  };

  return (
    <article
      onMouseEnter={() => !isTouch && setHover(true)}
      onMouseLeave={() => !isTouch && setHover(false)}
      className="ga-tap-scale"
      style={{
        position: 'relative', background: 'var(--color-background)',
        borderRadius: 'var(--rounded-card)', overflow: 'hidden',
        fontFamily: 'var(--font-body)', cursor: 'pointer',
        boxShadow: hover ? 'var(--shadow-raised)' : 'var(--shadow-card)',
        transition: 'box-shadow 0.35s cubic-bezier(0.25,0.46,0.45,0.94)',
        ...style,
      }}
      {...rest}
    >
      {/* ── Image ── */}
      <div style={{
        position: 'relative', aspectRatio: '3 / 4', background: '#fff',
        overflow: 'hidden', borderRadius: 'var(--rounded-block)',
      }}>
        {href ? (
          <Link
            href={href}
            aria-label={name}
            onClick={onClick}
            style={{ position: 'absolute', inset: 0, zIndex: 0 }}
          >
            <Image src={image} alt={imageAlt || name} fill sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              style={{
                objectFit: 'cover',
                transform: hover && !hoverImage ? 'scale(1.06)' : 'scale(1)',
                opacity: hover && hoverImage && !isTouch ? 0 : 1,
                transition: 'transform 0.55s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease',
              }} />
            {hoverImage && !isTouch && (
              <Image src={hoverImage} alt="" aria-hidden fill sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                style={{
                  objectFit: 'cover',
                  opacity: hover ? 1 : 0,
                  transition: 'opacity 0.35s ease',
                }} />
            )}
          </Link>
        ) : (
          <>
            <Image src={image} alt={imageAlt || name} fill sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              style={{
                objectFit: 'cover',
                transform: hover && !hoverImage ? 'scale(1.06)' : 'scale(1)',
                opacity: hover && hoverImage && !isTouch ? 0 : 1,
                transition: 'transform 0.55s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease',
              }} />
            {hoverImage && !isTouch && (
              <Image src={hoverImage} alt="" aria-hidden fill sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                style={{
                  objectFit: 'cover',
                  opacity: hover ? 1 : 0,
                  transition: 'opacity 0.35s ease',
                }} />
            )}
          </>
        )}

        {soldOut && (
          <div style={{ position: 'absolute', top: '0.875rem', insetInlineStart: '0.875rem' }}>
            <Badge variant="soldout">Sold Out</Badge>
          </div>
        )}

        {/* Wishlist heart — lucide's Heart (properly centered by construction, unlike the
            hand-drawn path this replaced) with a warmer red + a hover tint for affordance. */}
        <button
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          onClick={handleWishlist}
          onMouseEnter={() => setHeartHover(true)}
          onMouseLeave={() => setHeartHover(false)}
          style={{
            position: 'absolute', top: '0.875rem', insetInlineEnd: '0.875rem',
            width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 'var(--rounded-full)', border: 'none', cursor: 'pointer',
            background: wished ? 'rgba(255,255,255,0.96)' : 'rgba(255,255,255,0.82)',
            backdropFilter: 'blur(6px)',
            color: wished ? '#e11d48' : heartHover ? '#e11d48' : 'var(--color-foreground)',
            transform: heartPulse ? 'scale(1.38)' : heartHover ? 'scale(1.08)' : 'scale(1)',
            transition: 'transform 0.35s cubic-bezier(0.075,0.82,0.165,1), color 0.2s ease, background 0.2s ease',
            boxShadow: wished ? '0 0 0 1.5px rgba(225,29,72,0.25)' : 'none',
          }}>
          <Heart size={18} strokeWidth={1.8} fill={wished ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* ── Info ── */}
      <div style={{ padding: '1rem 0.875rem 1.125rem' }}>
        {/* Name */}
        {href ? (
          <h3 style={{
            margin: '0 0 0.35rem',
            fontFamily: 'var(--font-heading)', fontWeight: 500,
            fontSize: '0.9375rem', lineHeight: 1.35,
            color: 'var(--color-foreground)',
          }}>
            <Link href={href} style={{ color: 'inherit', textDecoration: 'none' }}>
              {name}
            </Link>
          </h3>
        ) : (
          <h3 style={{
            margin: '0 0 0.35rem',
            fontFamily: 'var(--font-heading)', fontWeight: 500,
            fontSize: '0.9375rem', lineHeight: 1.35,
            color: 'var(--color-foreground)',
          }}>{name}</h3>
        )}

        {/* Metal / stone */}
        {meta && (
          <p style={{
            margin: '0 0 0.65rem',
            fontSize: '0.8125rem', lineHeight: 1.45,
            color: 'var(--color-foreground-muted)',
          }}>{meta}</p>
        )}

        {/* Price */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
          {salePrice ? (
            <>
              <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-sale-price)' }}>
                {fmt(salePrice)}
              </span>
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-foreground-muted)', textDecoration: 'line-through' }}>
                {fmt(price)}
              </span>
            </>
          ) : (
            <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--color-foreground)' }}>
              {fmt(price)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
