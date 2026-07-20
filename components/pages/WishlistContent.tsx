'use client';

import ProductCard from '@/components/commerce/ProductCard';
import Button from '@/components/core/Button';
import { Heart, ArrowRight } from '@/components/core/Icons';
import RevealBlock from '@/components/motion/RevealBlock';
import RevealList from '@/components/motion/RevealList';
import { TextEffect } from '@/components/core/text-effect';
import { useCatalog } from '@/lib/catalog-context';
import { useStore } from '@/lib/store';

export default function WishlistContent() {
  const { wishlist, toggleWishlist, navigate } = useStore();
  const { products } = useCatalog();
  const items = products.filter((p) => wishlist.includes(p.id));

  return (
    <>
      <RevealBlock>
        <span
          style={{
            fontFamily: 'var(--font-wordmark)',
            fontSize: 11,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--color-brand)',
            display: 'block',
            marginBottom: 14,
          }}
        >
          Your Collection
        </span>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: 44,
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          <TextEffect
            as="h1"
            per="char"
            preset="fade"
            delay={0.1}
            speedReveal={2.2}
            style={{
              margin: 0,
              fontFamily: 'var(--font-heading)',
              fontWeight: 500,
              fontSize: 'clamp(2rem,5vw,3.2rem)',
              lineHeight: 1,
            }}
          >
            Saved Pieces
          </TextEffect>
          {items.length > 0 && (
            <span style={{ fontSize: 14, color: 'var(--color-foreground-muted)' }}>
              {items.length} {items.length === 1 ? 'piece' : 'pieces'} saved
            </span>
          )}
        </div>
      </RevealBlock>

      {items.length === 0 ? (
        <RevealBlock delay={0.2}>
          <div style={{ textAlign: 'center', padding: '80px 40px' }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 9999,
                border: '1.5px solid var(--color-border-dark)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-foreground-muted)',
                margin: '0 auto 24px',
              }}
            >
              <Heart size={32} />
            </div>
            <h2 style={{ margin: '0 0 12px', fontFamily: 'var(--font-heading)', fontWeight: 400, fontSize: 24 }}>
              Nothing saved yet
            </h2>
            <p style={{ margin: '0 0 28px', color: 'var(--color-foreground-muted)', fontSize: 15, lineHeight: 1.6 }}>
              Heart any piece to save it here.
            </p>
            <Button variant="secondary" as="a" href="/collection" iconRight={<ArrowRight size={16} />}>
              Browse the Collection
            </Button>
          </div>
        </RevealBlock>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(256px,1fr))', gap: 32 }}>
          <RevealList stagger={0.08}>
            {items.map((p) => (
              <ProductCard
                key={p.id}
                image={p.img}
                href={`/products/${p.id}`}
                name={p.name}
                meta={p.meta}
                // Commented out: no backend field. Restore if products.Item gains these.
                // igi={p.igi}
                price={p.price}
                salePrice={p.salePrice}
                currency="EGP"
                wished
                onWishlist={() => toggleWishlist(p.id)}
                onClick={() => navigate('pdp', p.id)}
                data-cursor="View"
              />
            ))}
          </RevealList>
        </div>
      )}
    </>
  );
}
