'use client';
import { useState } from 'react';
import StorefrontShell from '@/components/layout/StorefrontShell';
import ProductCard from '@/components/commerce/ProductCard';
import RevealBlock from '@/components/motion/RevealBlock';
import RevealList from '@/components/motion/RevealList';
import { PRODUCTS, CATEGORIES } from '@/lib/data';
import { useStore } from '@/lib/store';

export default function CollectionPage() {
  const { wishlist, toggleWishlist, navigate } = useStore();
  const [active, setActive] = useState('All');
  const [sort, setSort] = useState('featured');

  const filtered = active === 'All' ? PRODUCTS : PRODUCTS.filter(p => p.cat === active);
  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'low') return (a.salePrice || a.price) - (b.salePrice || b.price);
    if (sort === 'high') return (b.salePrice || b.price) - (a.salePrice || a.price);
    return 0;
  });

  return (
    <StorefrontShell>
      <div style={{ maxWidth: 'var(--page-width)', margin: '0 auto', padding: 'clamp(40px,5vw,80px) clamp(20px,3vw,40px)' }}>
        <RevealBlock>
          <nav style={{ fontSize: 13, color: 'var(--color-foreground-muted)', marginBottom: 18 }}>
            Home · <span style={{ color: 'var(--color-foreground)' }}>{active === 'All' ? 'All Jewelry' : active}</span>
          </nav>
          <h1 style={{ margin: '0 0 6px', fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: 'clamp(2rem,5vw,3rem)', lineHeight: 1 }}>
            {active === 'All' ? 'Lab Diamond Jewelry' : active}
          </h1>
          <p style={{ margin: '0 0 28px', color: 'var(--color-foreground-muted)', fontSize: 15 }}>
            {sorted.length} pieces · all IGI-certified
          </p>
        </RevealBlock>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap',
          gap: 14, paddingBottom: 22, marginBottom: 36, borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActive(cat)} style={{
                padding: '9px 20px', borderRadius: 'var(--rounded-button)', cursor: 'pointer', fontSize: 14,
                fontFamily: 'var(--font-body)', fontWeight: active === cat ? 500 : 400,
                background: active === cat ? 'var(--color-brand)' : 'transparent',
                color: active === cat ? '#fff' : 'var(--color-foreground)',
                border: `1px solid ${active === cat ? 'var(--color-brand)' : 'var(--color-border-dark)'}`,
                transition: 'all var(--animation-primary)',
              }}>{cat}</button>
            ))}
          </div>
          <select value={sort} onChange={e => setSort(e.target.value)} style={{
            height: 44, padding: '0 18px', borderRadius: 'var(--rounded-button)',
            border: '1px solid var(--color-border-dark)', background: '#fff',
            fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-foreground)', cursor: 'pointer' }}>
            <option value="featured">Featured</option>
            <option value="low">Price · Low to High</option>
            <option value="high">Price · High to Low</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(256px, 1fr))', gap: 32 }}>
          <RevealList stagger={0.07}>
            {sorted.map(p => (
              <ProductCard key={p.id} image={p.img} name={p.name} meta={p.meta} igi={p.igi}
                price={p.price} salePrice={p.salePrice} currency="EGP"
                wished={wishlist.includes(p.id)} onWishlist={() => toggleWishlist(p.id)}
                onClick={() => navigate('pdp', p.id)} data-cursor="View" />
            ))}
          </RevealList>
        </div>
      </div>
    </StorefrontShell>
  );
}
