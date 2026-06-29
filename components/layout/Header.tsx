'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Search, Heart, ShoppingBag, User, ArrowRight, Shield } from 'lucide-react';
import MagnetEl from '../motion/MagnetEl';
import CustomCursor from '../motion/CustomCursor';
import { PRODUCTS } from '@/lib/data';
import type { Product } from '@/lib/data';

const NAV_CONFIG = [
  { label: 'Rings',     cats: ['Shop All', 'Solitaire', 'Pavé Bands', 'Eternity', 'Stackables'],   catKey: 'Rings' },
  { label: 'Necklaces', cats: ['Shop All', 'Pendants', 'Tennis', 'Drop Styles', 'Layering Chains'], catKey: 'Necklaces' },
  { label: 'Bracelets', cats: ['Shop All', 'Tennis Bracelets', 'Bangles', 'Links', 'Chains'],        catKey: 'Bracelets' },
  { label: 'Earrings',  cats: ['Shop All', 'Studs', 'Drop Earrings', 'Huggies', 'Ear Cuffs'],       catKey: 'Earrings' },
  { label: 'Piercings', cats: ['Shop All', 'Helix', 'Tragus', 'Lobe', 'Daith'],                     catKey: null },
];

function MiniCard({ product, onProduct, visible, delay }: {
  product: Product; onProduct: (id: string) => void; visible: boolean; delay: number;
}) {
  const [hover, setHover] = useState(false);
  return (
    <div onClick={() => onProduct(product.id)}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        cursor: 'pointer',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: `opacity 0.32s ease ${delay}s, transform 0.42s cubic-bezier(0.075,0.82,0.165,1) ${delay}s`,
      }}>
      <div style={{ aspectRatio: '3/4', borderRadius: 10, overflow: 'hidden',
        background: 'var(--color-surface)', marginBottom: 10 }}>
        <img src={product.img} alt={product.name} style={{
          width: '100%', height: '100%', objectFit: 'cover',
          transform: hover ? 'scale(1.07)' : 'scale(1)',
          transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1)',
        }} />
      </div>
      <p style={{ margin: '0 0 3px', fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: 13, lineHeight: 1.35,
        color: hover ? 'var(--color-brand)' : 'var(--color-foreground)', transition: 'color 0.2s ease' }}>
        {product.name}</p>
      <p style={{ margin: '0 0 3px', fontSize: 11, color: 'var(--color-foreground-muted)' }}>{product.meta}</p>
      <p style={{ margin: 0, fontSize: 12, fontWeight: 500, color: 'var(--color-foreground)' }}>
        {(product.salePrice || product.price).toLocaleString()} EGP</p>
    </div>
  );
}

export default function Header({ cartCount = 0, onCart }: {
  cartCount?: number; onCart?: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const openMenu  = (name: string) => { clearTimeout(closeTimer.current!); setActiveMenu(name); };
  const schedClose = () => { closeTimer.current = setTimeout(() => setActiveMenu(null), 200); };
  const cancelClose = () => { if (closeTimer.current) clearTimeout(closeTimer.current); };

  const getProducts = (catKey: string | null) => {
    const base = catKey ? PRODUCTS.filter(p => p.cat === catKey) : [];
    const fill = [...base];
    PRODUCTS.forEach(p => { if (fill.length < 3 && !fill.find(x => x.id === p.id)) fill.push(p); });
    return fill.slice(0, 3);
  };

  const currentConfig = NAV_CONFIG.find(n => n.label === activeMenu);
  const menuProducts = activeMenu ? getProducts(currentConfig?.catKey ?? null) : [];

  const NavItem = ({ item }: { item: typeof NAV_CONFIG[number] }) => (
    <MagnetEl>
      <button
        onMouseEnter={() => openMenu(item.label)}
        onMouseLeave={schedClose}
        style={{
          background: 'transparent', border: 'none', cursor: 'pointer',
          padding: '12px 13px', display: 'flex', alignItems: 'center', gap: 4,
          fontFamily: 'var(--font-heading)', fontWeight: 500,
          fontSize: 'clamp(0.875rem,0.748rem + 0.254vw,1rem)',
          letterSpacing: '-0.4px',
          color: activeMenu === item.label ? 'var(--color-brand)' : 'var(--color-foreground)',
          transition: 'color 0.2s ease',
        }}>
        {item.label}
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden
          style={{ flexShrink: 0, opacity: 0.5,
            transform: activeMenu === item.label ? 'rotate(180deg)' : 'rotate(0)',
            transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)' }}>
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>
    </MagnetEl>
  );

  const IconBtn = ({ icon: C, label, badge, onClick }: {
    icon: React.ComponentType<{ size?: number }>; label: string; badge?: number; onClick?: () => void;
  }) => (
    <button aria-label={label} onClick={onClick} style={{
      position: 'relative', width: 42, height: 42,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'transparent', border: 'none', cursor: 'pointer',
      color: 'var(--color-foreground)',
    }}>
      <C size={21} />
      {badge !== undefined && badge > 0 && (
        <span style={{ position: 'absolute', top: 5, right: 5, minWidth: 16, height: 16,
          padding: '0 3px', borderRadius: 9999, background: 'var(--color-brand)',
          color: '#fff', fontSize: 10, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{badge}</span>
      )}
    </button>
  );

  const ghostLink = (label: string) => (
    <MagnetEl>
      <button style={{
        background: 'transparent', border: 'none', cursor: 'pointer', padding: '12px 12px',
        fontFamily: 'var(--font-heading)', fontWeight: 400,
        fontSize: 'clamp(0.8125rem,0.748rem + 0.127vw,0.9375rem)',
        letterSpacing: '-0.3px', color: 'var(--color-foreground-muted)',
        transition: 'color 0.2s ease',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color='var(--color-foreground)'}
      onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color='var(--color-foreground-muted)'}>
        {label}
      </button>
    </MagnetEl>
  );

  return (
    <>
      <CustomCursor />
      <header style={{
        position: 'sticky', top: 0, zIndex: 20,
        background: scrolled ? 'rgba(255,255,255,0.94)' : 'rgba(255,255,255,0.74)',
        backdropFilter: 'blur(14px)',
        boxShadow: (scrolled || activeMenu) ? '0 1px 0 var(--color-border)' : 'none',
        borderStartStartRadius: 'var(--border-radius)', borderStartEndRadius: 'var(--border-radius)',
        transition: 'background var(--animation-primary), box-shadow var(--animation-primary)',
      }}>
        <div style={{
          maxWidth: 'var(--page-width)', margin: '0 auto',
          padding: '0 clamp(16px,2.5vw,36px)', height: 'var(--header-height)',
          display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center',
        }}>
          <nav style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
            {ghostLink('Home')}
            <span style={{ width: 1, height: 16, background: 'var(--color-border)', margin: '0 4px' }} />
            {NAV_CONFIG.map(item => <NavItem key={item.label} item={item} />)}
          </nav>

          <div style={{ cursor: 'pointer', justifySelf: 'center', padding: '0 20px' }}>
            <Image src="/assets/logo-wordmark.png" alt="Gemma Azzurro" width={140} height={21}
              style={{ display: 'block', transition: 'opacity 0.2s ease' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 0, justifySelf: 'end' }}>
            {ghostLink('Contact')}
            <span style={{ width: 1, height: 16, background: 'var(--color-border)', margin: '0 4px' }} />
            <IconBtn icon={Search} label="Search" />
            <IconBtn icon={User} label="Account" />
            <IconBtn icon={Heart} label="Wishlist" />
            <IconBtn icon={ShoppingBag} label="Cart" badge={cartCount} onClick={onCart} />
          </div>
        </div>

        <div
          onMouseEnter={cancelClose}
          onMouseLeave={schedClose}
          style={{
            position: 'absolute',
            top: 'var(--header-height)',
            left: '50%',
            width: 'min(1020px, calc(100% - 40px))',
            opacity: activeMenu ? 1 : 0,
            transform: activeMenu
              ? 'translateX(-50%) translateY(0) scale(1)'
              : 'translateX(-50%) translateY(-10px) scale(0.99)',
            pointerEvents: activeMenu ? 'auto' : 'none',
            transition: 'opacity 0.26s ease, transform 0.34s cubic-bezier(0.075,0.82,0.165,1)',
            background: '#fff',
            borderRadius: '0 0 var(--border-radius) var(--border-radius)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.09), 0 4px 12px rgba(0,0,0,0.05)',
            border: '1px solid var(--color-border)',
            borderTop: '1px solid rgba(0,0,0,0.04)',
            overflow: 'hidden',
            zIndex: 10,
          }}>
          {activeMenu && (
            <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', minHeight: 340 }}>
              <div style={{
                background: 'var(--color-surface)',
                borderRight: '1px solid var(--color-border)',
                padding: '30px 22px 30px',
                display: 'flex', flexDirection: 'column',
              }}>
                <p style={{ fontFamily: 'var(--font-wordmark)', fontSize: 10, letterSpacing: '0.18em',
                  textTransform: 'uppercase', color: 'var(--color-foreground-muted)', margin: '0 0 18px' }}>
                  {activeMenu} — Shop</p>
                {currentConfig?.cats.map((cat, i) => (
                  <button key={cat}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '10px 10px 10px 0', background: 'transparent', border: 'none',
                      cursor: 'pointer', textAlign: 'left', width: '100%',
                      fontFamily: 'var(--font-body)', fontSize: i === 0 ? 14 : 13.5,
                      fontWeight: i === 0 ? 600 : 400,
                      color: i === 0 ? 'var(--color-brand)' : 'var(--color-foreground)',
                      borderBottom: i < currentConfig.cats.length - 1 ? '1px solid var(--color-border)' : 'none',
                      opacity: activeMenu ? 1 : 0,
                      transform: activeMenu ? 'translateX(0)' : 'translateX(-12px)',
                      transition: `opacity 0.28s ease ${i * 0.045 + 0.08}s, transform 0.35s cubic-bezier(0.075,0.82,0.165,1) ${i * 0.045 + 0.08}s, color 0.15s ease, padding 0.15s ease`,
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-brand)';
                      (e.currentTarget as HTMLButtonElement).style.paddingLeft = '8px';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.color = i === 0 ? 'var(--color-brand)' : 'var(--color-foreground)';
                      (e.currentTarget as HTMLButtonElement).style.paddingLeft = '0';
                    }}>
                    <span>{cat}</span>
                    {i === 0 && (
                      <ArrowRight size={12} style={{ opacity: 0.5, flexShrink: 0 }} />
                    )}
                  </button>
                ))}
                <div style={{ marginTop: 'auto', paddingTop: 20 }}>
                  <div style={{ padding: '10px 12px', background: 'var(--color-igi-bg)',
                    borderRadius: 'var(--rounded-card)', fontSize: 11, color: 'var(--color-igi)',
                    fontWeight: 500, lineHeight: 1.5 }}>
                    All pieces IGI certified
                  </div>
                </div>
              </div>

              <div style={{ padding: '30px 28px 28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
                  <p style={{ fontFamily: 'var(--font-wordmark)', fontSize: 10, letterSpacing: '0.18em',
                    textTransform: 'uppercase', color: 'var(--color-foreground-muted)', margin: 0 }}>
                    Featured pieces</p>
                  <button
                    style={{
                      background: 'transparent', border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 5,
                      fontFamily: 'var(--font-body)', fontSize: 13,
                      color: 'var(--color-brand)', fontWeight: 500,
                      opacity: activeMenu ? 1 : 0,
                      transition: `opacity 0.3s ease 0.28s`,
                    }}>
                    View all {activeMenu}
                    <ArrowRight size={13} />
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
                  {menuProducts.map((product, i) => (
                    <MiniCard
                      key={product.id}
                      product={product}
                      onProduct={(id: string) => setActiveMenu(null)}
                      visible={!!activeMenu}
                      delay={i * 0.075 + 0.14}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
