'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Close, Search as SearchIcon } from '@/components/core/Icons';
import { PRODUCTS } from '@/lib/data';
import { useStore } from '@/lib/store';
import ProductCard from '@/components/commerce/ProductCard';
import RevealList from '@/components/motion/RevealList';

const CATS = ['Rings', 'Necklaces', 'Bracelets', 'Earrings'];

export default function SearchOverlay() {
  const { searchOpen, searchQuery, setSearchOpen, setSearchQuery, navigate } = useStore();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 340);
    }
  }, [searchOpen]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') setSearchOpen(false); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [setSearchOpen]);

  const results = searchQuery.length > 1
    ? PRODUCTS.filter(p =>
        [p.name, p.cat, p.meta, p.stone].join(' ').toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'color-mix(in srgb, var(--color-background) 98%, transparent)', backdropFilter: 'blur(16px)',
      transform: searchOpen ? 'translateY(0)' : 'translateY(-100%)',
      transition: 'transform 0.45s cubic-bezier(0.075,0.82,0.165,1)',
      overflowY: 'auto',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 clamp(20px,3vw,40px)', height: 'var(--header-height)',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <Image src="/assets/logo-wordmark.png" alt="Gemma Azzurro" width={140} height={20} style={{ display: 'block' }} />
        <button onClick={() => setSearchOpen(false)} style={{
          width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-foreground)',
        }}><Close size={22} /></button>
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '52px clamp(20px,3vw,40px) 0' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 18,
          borderBottom: '2px solid var(--color-foreground)', paddingBottom: 18, marginBottom: 52,
        }}>
          <SearchIcon size={26} style={{ flexShrink: 0, opacity: 0.35 }} />
          <input
            ref={inputRef} value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search rings, necklaces, lab diamond..."
            style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent',
              fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.5rem,3vw,2.25rem)',
              fontWeight: 400, color: 'var(--color-foreground)', letterSpacing: '-0.02em',
              height: 48,
            }} />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: 'var(--color-foreground-muted)', padding: 8, display: 'flex',
            }}><Close size={18} /></button>
          )}
        </div>

        {!searchQuery && (
          <div>
            <p style={{
              fontFamily: 'var(--font-wordmark)', fontSize: 11, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: 'var(--color-foreground-muted)', marginBottom: 20,
            }}>Browse by category</p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {CATS.map(c => (
                <button key={c} onClick={() => setSearchQuery(c)} style={{
                  padding: '10px 22px', borderRadius: 'var(--rounded-button)',
                  border: '1.5px solid var(--color-border-dark)', background: 'transparent',
                  fontFamily: 'var(--font-body)', fontSize: 14, cursor: 'pointer',
                  color: 'var(--color-foreground)', transition: 'all var(--animation-primary)',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background='var(--color-brand)'; (e.currentTarget as HTMLButtonElement).style.color='#fff'; (e.currentTarget as HTMLButtonElement).style.borderColor='var(--color-brand)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background='transparent'; (e.currentTarget as HTMLButtonElement).style.color='var(--color-foreground)'; (e.currentTarget as HTMLButtonElement).style.borderColor='var(--color-border-dark)'; }}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div style={{ maxWidth: 'var(--page-width)', margin: '0 auto', padding: '8px clamp(20px,3vw,40px) 64px' }}>
          <p style={{
            marginBottom: 28, fontSize: 12,
            fontFamily: 'var(--font-wordmark)', letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'var(--color-foreground-muted)',
          }}>{results.length} result{results.length !== 1 ? 's' : ''}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 28 }}>
            <RevealList stagger={0.06}>
              {results.map(p => (
                <ProductCard key={p.id} image={p.img} name={p.name} meta={p.meta} igi={p.igi}
                  href={`/products/${p.id}`}
                  price={p.price} salePrice={p.salePrice} currency="EGP"
                  onClick={() => { navigate('pdp', p.id); setSearchOpen(false); }} />
              ))}
            </RevealList>
          </div>
        </div>
      )}

      {searchQuery.length > 1 && results.length === 0 && (
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 clamp(20px,3vw,40px)', textAlign: 'center' }}>
          <p style={{ fontSize: 16, color: 'var(--color-foreground-muted)' }}>No results for &quot;{searchQuery}&quot;</p>
          <p style={{ fontSize: 14, color: 'var(--color-foreground-muted)', marginTop: 6 }}>
            Try a different term or browse our collections.</p>
        </div>
      )}
    </div>
  );
}
