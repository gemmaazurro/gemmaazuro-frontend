'use client';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { PRODUCTS } from '@/lib/data';
import ProductCard from '../commerce/ProductCard';
import RevealBlock from '../motion/RevealBlock';
import Button from '../core/Button';

export default function FeaturedGrid() {
  const router = useRouter();
  const featured = PRODUCTS.slice(0, 4);
  return (
    <section style={{ maxWidth: 'var(--page-width)', margin: '0 auto',
      padding: '16px clamp(20px,3vw,40px) 56px' }}>
      <RevealBlock>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
          <div>
            <span style={{ fontFamily: 'var(--font-wordmark)', fontSize: 11, letterSpacing: '0.2em',
              textTransform: 'uppercase', color: 'var(--color-brand)', display: 'block', marginBottom: 10 }}>New Arrivals</span>
            <h2 style={{ fontWeight: 500, fontSize: 'var(--text-4xl)', lineHeight: 1 }}>The Solitaire Edit</h2>
          </div>
          <Link href="/collection">
            <Button variant="ghost" iconRight={<ArrowRight size={16} />}>View all</Button>
          </Link>
        </div>
      </RevealBlock>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 28 }}>
        {featured.map((p, i) => (
          <div key={p.id} style={{ opacity: 0, animation: `ga-appear-up 0.4s ease ${i * 0.1}s both` }}>
            <ProductCard
              image={p.img} name={p.name} meta={p.meta} igi={p.igi}
              price={p.price} salePrice={p.salePrice}
              onClick={() => router.push(`/products/${p.id}`)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
