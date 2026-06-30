'use client';

import ProductCard from '@/components/commerce/ProductCard';
import Button from '@/components/core/Button';
import { ArrowRight } from '@/components/core/Icons';
import RevealBlock from '@/components/motion/RevealBlock';
import RevealList from '@/components/motion/RevealList';
import { PRODUCTS } from '@/lib/data';
import { useStore } from '@/lib/store';

export default function HomeFeaturedProducts() {
  const { wishlist, toggleWishlist, navigate } = useStore();
  const featured = PRODUCTS.slice(0, 4);

  return (
    <section
      style={{
        maxWidth: 'var(--page-width)',
        margin: '0 auto',
        padding: '16px clamp(20px,3vw,40px) 56px',
      }}
    >
      <RevealBlock>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: 32,
          }}
        >
          <div>
            <span
              style={{
                fontFamily: 'var(--font-wordmark)',
                fontSize: 11,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--color-brand)',
                display: 'block',
                marginBottom: 10,
              }}
            >
              New Arrivals
            </span>
            <h2
              style={{
                margin: 0,
                fontFamily: 'var(--font-heading)',
                fontWeight: 500,
                fontSize: 'var(--text-4xl)',
                lineHeight: 1,
              }}
            >
              The Solitaire Edit
            </h2>
          </div>
          <Button variant="ghost" as="a" href="/collection" iconRight={<ArrowRight size={16} />}>
            View all
          </Button>
        </div>
      </RevealBlock>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 28 }}>
        <RevealList stagger={0.1}>
          {featured.map((p) => (
            <ProductCard
              key={p.id}
              image={p.img}
              href={`/products/${p.id}`}
              name={p.name}
              meta={p.meta}
              igi={p.igi}
              price={p.price}
              salePrice={p.salePrice}
              currency="EGP"
              wished={wishlist.includes(p.id)}
              onWishlist={() => toggleWishlist(p.id)}
              onClick={() => navigate('pdp', p.id)}
              data-cursor="View"
            />
          ))}
        </RevealList>
      </div>
    </section>
  );
}
