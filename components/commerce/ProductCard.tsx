'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Heart, Shield } from 'lucide-react';
import Badge from '../core/Badge';

interface ProductCardProps {
  image: string; name: string; meta: string; igi?: string;
  price: number; salePrice?: number; currency?: string;
  wished?: boolean; onWishlist?: () => void; onClick?: () => void;
}

export default function ProductCard({ image, name, meta, igi, price, salePrice, currency = 'EGP', wished = false, onWishlist, onClick }: ProductCardProps) {
  const [hover, setHover] = useState(false);
  const [hearted, setHearted] = useState(wished);
  return (
    <div onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ cursor: 'pointer', position: 'relative' }}>
      <div style={{
        position: 'relative', aspectRatio: '3/4', borderRadius: 'var(--rounded-card)',
        overflow: 'hidden', background: 'var(--color-surface)',
        boxShadow: 'var(--shadow-card)', marginBottom: 14,
      }}>
        <Image src={image} alt={name} fill
          style={{ objectFit: 'cover', transform: hover ? 'scale(1.06)' : 'scale(1)',
            transition: 'transform 0.6s var(--ease-fill)' }} />
        <button onClick={e => { e.stopPropagation(); setHearted(h => !h); onWishlist?.(); }}
          aria-label={hearted ? 'Remove from wishlist' : 'Add to wishlist'}
          style={{
            position: 'absolute', top: 12, right: 12, width: 36, height: 36,
            borderRadius: '50%', background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(4px)',
            border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
          <Heart size={16} fill={hearted ? '#BE123C' : 'none'} color={hearted ? '#BE123C' : 'var(--color-foreground)'} />
        </button>
      </div>
      {igi && (
        <Badge variant="igi" style={{ marginBottom: 8 }}>
          <Shield size={10} /> {igi}
        </Badge>
      )}
      <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: 15,
        color: hover ? 'var(--color-brand)' : 'var(--color-foreground)',
        transition: 'color 0.2s ease', margin: '0 0 4px', lineHeight: 1.3 }}>{name}</p>
      <p style={{ fontSize: 12, color: 'var(--color-foreground-muted)', margin: '0 0 8px' }}>{meta}</p>
      <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
        {salePrice ? (
          <>
            <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-sale-price)' }}>
              {salePrice.toLocaleString()} {currency}</span>
            <span style={{ fontSize: 13, color: 'var(--color-foreground-muted)', textDecoration: 'line-through' }}>
              {price.toLocaleString()} {currency}</span>
          </>
        ) : (
          <span style={{ fontSize: 15, fontWeight: 600 }}>{price.toLocaleString()} {currency}</span>
        )}
      </div>
    </div>
  );
}
