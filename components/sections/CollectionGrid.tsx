'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PRODUCTS, CATEGORIES } from '@/lib/data';
import ProductCard from '../commerce/ProductCard';

export default function CollectionGrid() {
  const [active, setActive] = useState('All');
  const router = useRouter();
  const filtered = active === 'All' ? PRODUCTS : PRODUCTS.filter(p => p.cat === active);
  return (
    <div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 40, flexWrap: 'wrap', justifyContent: 'center' }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActive(cat)}
            className="ga-btn"
            style={{
              height: 40, padding: '0 20px', fontSize: 13,
              background: active === cat ? 'var(--color-brand)' : 'transparent',
              color: active === cat ? '#fff' : 'var(--color-foreground)',
              border: `1px solid ${active === cat ? 'var(--color-brand)' : 'var(--color-border-dark)'}`,
            }}>
            {cat}
          </button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 32 }}>
        {filtered.map((p, i) => (
          <div key={p.id} style={{ animation: `ga-appear-up 0.4s ease ${i * 0.07}s both` }}>
            <ProductCard
              image={p.img} name={p.name} meta={p.meta} igi={p.igi}
              price={p.price} salePrice={p.salePrice}
              onClick={() => router.push(`/products/${p.id}`)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
