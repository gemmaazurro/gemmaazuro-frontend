'use client';

import { useMemo, useState, useRef } from 'react';
import Image from 'next/image';
import { Heart } from '@/components/core/Icons';
import type { Product } from '@/lib/data';
import Accordion from '@/components/core/Accordion';
import Rating from '@/components/commerce/Rating';
import VariantSelector from '@/components/commerce/VariantSelector';
import WhatsAppCTA from '@/components/commerce/WhatsAppCTA';
import Button from '@/components/core/Button';
import ProductCard from '@/components/commerce/ProductCard';
import RevealBlock from '@/components/motion/RevealBlock';
import RevealList from '@/components/motion/RevealList';
import { TextEffect } from '@/components/core/text-effect';
import { useStore } from '@/lib/store';

interface ProductDetailsClientProps {
  product: Product;
  related: Product[];
  thumbs: string[];
}

export default function ProductDetailsClient({ product, related, thumbs }: ProductDetailsClientProps) {
  const { wishlist, toggleWishlist, addToCart, navigate } = useStore();
  const [zoom, setZoom] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [thumbIdx, setThumbIdx] = useState(0);
  const wished = wishlist.includes(product.id);

  const currentImage = useMemo(() => thumbs[thumbIdx] || product.img, [thumbIdx, thumbs, product.img]);
  const isTouch = typeof window !== 'undefined' && 'ontouchstart' in window;
  const [fullscreenIdx, setFullscreenIdx] = useState(-1);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.changedTouches.length === 1) {
      const diffX = touchStartX.current - e.changedTouches[0].clientX;
      const diffY = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0 && fullscreenIdx < thumbs.length - 1) {
          setFullscreenIdx(fullscreenIdx + 1);
        } else if (diffX < 0 && fullscreenIdx > 0) {
          setFullscreenIdx(fullscreenIdx - 1);
        }
      }
    }
  };

  const onMove = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPos({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <>
      <RevealBlock as="nav" style={{ fontSize: 13, color: 'var(--color-foreground-muted)', marginBottom: 28 }}>
        Home · {product.cat} · <span style={{ color: 'var(--color-foreground)' }}>{product.name}</span>
      </RevealBlock>

      <div style={{ display: 'grid', gridTemplateColumns: 'var(--grid-pdp)', gap: 'clamp(28px,5vw,72px)', alignItems: 'start' }}>
        <RevealBlock delay={0.05} style={{ display: 'flex', gap: 14, position: 'var(--pdp-gallery-pos)' as any, top: 120 }}>
          <div style={{ display: 'flex', flexDirection: 'var(--pdp-gallery-flex-dir)' as any, gap: 10, overflow: 'var(--pdp-thumb-overflow)' as any }}>
            {thumbs.map((src, i) => (
              <div
                key={src}
                onClick={() => setThumbIdx(i)}
                style={{
                  width: 68,
                  height: 88,
                  borderRadius: 10,
                  overflow: 'hidden',
                  background: '#fcfcfd',
                  border: thumbIdx === i ? '1.5px solid var(--color-brand)' : '1px solid var(--color-border)',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s ease',
                  position: 'relative',
                }}
              >
                <Image
                  src={src}
                  alt=""
                  width={68}
                  height={88}
                  sizes="68px"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            ))}
          </div>
          <div
            onMouseEnter={() => !isTouch && setZoom(true)}
            onMouseLeave={() => !isTouch && setZoom(false)}
            onMouseMove={onMove}
            onClick={() => { if (isTouch) setFullscreenIdx(thumbIdx); }}
            data-cursor={zoom ? '' : 'Zoom'}
            style={{
              flex: 1,
              aspectRatio: '3/4',
              background: '#fcfcfd',
              borderRadius: 'var(--rounded-block)',
              overflow: 'hidden',
              cursor: zoom ? 'zoom-out' : 'crosshair',
              position: 'relative',
            }}
          >
            <Image
              src={currentImage}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: zoom ? 'scale(2.2)' : 'scale(1)',
                transformOrigin: `${pos.x}% ${pos.y}%`,
                transition: zoom ? 'none' : 'transform 0.4s var(--ease-default)',
              }}
            />
          </div>
        </RevealBlock>

        <RevealBlock delay={0.12}>
          <TextEffect
            as="h1"
            per="char"
            preset="fade"
            delay={0.18}
            speedReveal={2.2}
            style={{
              margin: '0 0 8px',
              fontFamily: 'var(--font-heading)',
              fontWeight: 500,
              fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
              lineHeight: 1.05,
            }}
          >
            {product.name}
          </TextEffect>
          <p style={{ margin: '0 0 14px', color: 'var(--color-foreground-muted)', fontSize: 15 }}>{product.meta}</p>
          <Rating value={product.rating} count={product.reviews} style={{ marginBottom: 22 }} />

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 22 }}>
            {product.salePrice ? (
              <>
                <span style={{ fontSize: 32, fontWeight: 600, color: 'var(--color-sale-price)' }}>
                  {product.salePrice.toLocaleString()} EGP
                </span>
                <span style={{ fontSize: 18, color: 'var(--color-foreground-muted)', textDecoration: 'line-through' }}>
                  {product.price.toLocaleString()} EGP
                </span>
              </>
            ) : (
              <span style={{ fontSize: 32, fontWeight: 500 }}>{product.price.toLocaleString()} EGP</span>
            )}
          </div>

          <VariantSelector
            label="Metal"
            style={{ marginBottom: 20 }}
            options={[
              { label: '18k White Gold', value: 'wg' },
              { label: '18k Yellow Gold', value: 'yg' },
              { label: 'Sterling Silver', value: 'ss' },
            ]}
          />
          <VariantSelector
            label="Ring Size"
            style={{ marginBottom: 28 }}
            options={['5', '5.5', '6', '6.5', '7', '7.5'].map((size) => ({ label: size, value: size }))}
          />

          <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
            <Button variant="primary" size="lg" fullWidth onClick={() => addToCart(product)}>
              Add to Cart
            </Button>
            <button
              aria-label="Wishlist"
              onClick={() => toggleWishlist(product.id)}
              style={{
                width: 58,
                flexShrink: 0,
                borderRadius: 'var(--rounded-button)',
                border: '2px solid var(--color-border-dark)',
                background: 'var(--color-background)',
                cursor: 'pointer',
                color: wished ? 'var(--color-sale-price)' : 'var(--color-foreground)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'color 0.2s ease, border-color 0.2s ease',
              }}
            >
              <Heart size={20} fill={wished ? 'currentColor' : 'none'} />
            </button>
          </div>

          <WhatsAppCTA
            message={`Hi Gemma Azzurro, I'd like to customize the ${product.name}.`}
            label="Customize or engrave via WhatsApp"
            style={{ marginBottom: 32 }}
          />

          <div style={{ borderTop: '1px solid var(--color-border)' }}>
            <Accordion title="Materials & Specifications" defaultOpen>
              {product.stone} · {product.carat} · {product.color}/{product.clarity} · {product.cut} cut. {product.meta}.
            </Accordion>
            <Accordion title="Care Guide">
              Store in the pouch provided, away from moisture. Clean gently with a soft cloth. Complimentary professional
              cleaning in-store.
            </Accordion>
            <Accordion title="Shipping & Returns">
              Complimentary insured delivery across Cairo. 14-day returns — contact us or visit the Zamalek atelier.
            </Accordion>
          </div>
        </RevealBlock>
      </div>

      <section style={{ marginTop: 88 }}>
        <RevealBlock>
          <h2
            style={{
              margin: '0 0 28px',
              fontFamily: 'var(--font-heading)',
              fontWeight: 500,
              fontSize: 'var(--text-3xl)',
              lineHeight: 1,
            }}
          >
            You may also like
          </h2>
        </RevealBlock>
        <div style={{ display: 'grid', gridTemplateColumns: 'var(--grid-related)', gap: 28 }}>
          <RevealList stagger={0.08}>
            {related.map((item) => (
              <ProductCard
                key={item.id}
                image={item.img}
                href={`/products/${item.id}`}
                name={item.name}
                meta={item.meta}
                igi={item.igi}
                price={item.price}
                salePrice={item.salePrice}
                currency="EGP"
                wished={wishlist.includes(item.id)}
                onWishlist={() => toggleWishlist(item.id)}
                onClick={() => navigate('pdp', item.id)}
              />
            ))}
          </RevealList>
        </div>
      </section>

      {fullscreenIdx >= 0 && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: '#000',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            touchAction: 'none',
          }}
          onClick={() => setFullscreenIdx(-1)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div style={{ position: 'relative', width: '100%', height: '100%', maxWidth: '100vw', maxHeight: '100vh' }}>
            <Image
              src={thumbs[fullscreenIdx] || product.img}
              alt={product.name}
              fill
              style={{ objectFit: 'contain', padding: 20 }}
              sizes="100vw"
              priority
            />
          </div>
          <button
            aria-label="Close fullscreen"
            onClick={(e) => { e.stopPropagation(); setFullscreenIdx(-1); }}
            style={{
              position: 'absolute', top: 16, right: 16,
              width: 44, height: 44, borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)', border: 'none',
              color: '#fff', fontSize: 24, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 10000, WebkitTapHighlightColor: 'transparent',
            }}
          >
            ✕
          </button>
          {fullscreenIdx > 0 && (
            <button
              aria-label="Previous image"
              onClick={(e) => { e.stopPropagation(); setFullscreenIdx(fullscreenIdx - 1); }}
              style={{
                position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                width: 44, height: 44, borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)', border: 'none',
                color: '#fff', fontSize: 20, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              ‹
            </button>
          )}
          {fullscreenIdx < thumbs.length - 1 && (
            <button
              aria-label="Next image"
              onClick={(e) => { e.stopPropagation(); setFullscreenIdx(fullscreenIdx + 1); }}
              style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                width: 44, height: 44, borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)', border: 'none',
                color: '#fff', fontSize: 20, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              ›
            </button>
          )}
          <div style={{
            position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
            color: 'rgba(255,255,255,0.6)', fontSize: 14,
            fontFamily: 'var(--font-body)',
          }}>
            {fullscreenIdx + 1} / {thumbs.length}
          </div>
        </div>
      )}
    </>
  );
}
