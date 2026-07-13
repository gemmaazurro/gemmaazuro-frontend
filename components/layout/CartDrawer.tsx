'use client';
import Image from 'next/image';
import { Close, ArrowRight, Shield, Bag } from '@/components/core/Icons';
import { WA_PHONE } from '@/lib/data';
import { useStore } from '@/lib/store';

export default function CartDrawer() {
  const { cartItems, cartOpen, setCartOpen, removeFromCart, updateQty } = useStore();

  const subtotal = cartItems.reduce((s, i) => s + (i.product.salePrice || i.product.price) * i.qty, 0);
  const orderText = cartItems.map(i =>
    `${i.qty}× ${i.product.name} (${i.product.meta}) — ${(i.product.salePrice||i.product.price).toLocaleString()} EGP`
  ).join('\n');
  const waMsg = encodeURIComponent(
    `Hi Gemma Azzurro, I'd like to order:\n\n${orderText}\n\nTotal: ${subtotal.toLocaleString()} EGP`
  );

  return (
    <>
      <div onClick={() => setCartOpen(false)} style={{
        position: 'fixed', inset: 0, zIndex: 49,
        background: 'rgba(0,0,0,0.28)',
        opacity: cartOpen ? 1 : 0, pointerEvents: cartOpen ? 'auto' : 'none',
        transition: 'opacity 0.35s ease',
      }} />

      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 'min(480px,100vw)', height: '100dvh', zIndex: 50,
        background: 'var(--color-background)', display: 'flex', flexDirection: 'column',
        transform: cartOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.45s cubic-bezier(0.075,0.82,0.165,1)',
        boxShadow: '-4px 0 48px rgba(0,0,0,0.10)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '24px 28px', borderBottom: '1px solid var(--color-border)',
        }}>
          <div>
            <h2 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: 22 }}>
              Your Bag</h2>
            <span style={{ fontSize: 13, color: 'var(--color-foreground-muted)' }}>
              {cartItems.length} {cartItems.length === 1 ? 'piece' : 'pieces'}
            </span>
          </div>
          <button onClick={() => setCartOpen(false)} style={{
            width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-foreground)',
          }}><Close size={22} /></button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {cartItems.length === 0 ? (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', height: '100%', gap: 18, padding: 48,
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: 9999,
                border: '1.5px solid var(--color-border-dark)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--color-foreground-muted)',
              }}><Bag size={28} /></div>
              <p style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 400 }}>
                Your bag is empty</p>
              <p style={{ margin: 0, fontSize: 14, color: 'var(--color-foreground-muted)', textAlign: 'center', lineHeight: 1.6 }}>
                Lab diamonds crafted for a lifetime.</p>
              <button onClick={() => setCartOpen(false)} style={{
                padding: '12px 28px', borderRadius: 'var(--rounded-button)',
                background: 'var(--color-brand)', color: '#fff', border: 'none',
                fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 500, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>Browse the Collection <ArrowRight size={16} /></button>
            </div>
          ) : cartItems.map((item, idx) => (
            <div key={item.product.id + idx} style={{
              display: 'grid', gridTemplateColumns: '84px 1fr', gap: 16,
              padding: '20px 28px', borderBottom: '1px solid var(--color-border)',
            }}>
              <div style={{
                width: 84, height: 108, borderRadius: 10, overflow: 'hidden',
                background: 'var(--color-surface)', position: 'relative',
              }}>
                <Image src={item.product.img} alt={item.product.name} fill
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ margin: '0 0 3px', fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: 15 }}>
                    {item.product.name}</p>
                  <p style={{ margin: '0 0 6px', fontSize: 13, color: 'var(--color-foreground-muted)' }}>
                    {item.product.meta}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                  <div style={{
                    display: 'flex', alignItems: 'center',
                    border: '1px solid var(--color-border-dark)',
                    borderRadius: 'var(--rounded-button)', overflow: 'hidden',
                  }}>
                    <button onClick={() => updateQty(idx, -1)} style={{
                      width: 34, height: 34, background: 'transparent', border: 'none',
                      cursor: 'pointer', fontSize: 18, color: 'var(--color-foreground)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>−</button>
                    <span style={{ width: 30, textAlign: 'center', fontSize: 14, fontWeight: 500 }}>
                      {item.qty}</span>
                    <button onClick={() => updateQty(idx, 1)} style={{
                      width: 34, height: 34, background: 'transparent', border: 'none',
                      cursor: 'pointer', fontSize: 18, color: 'var(--color-foreground)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>+</button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontWeight: 600, fontSize: 15 }}>
                      {((item.product.salePrice || item.product.price) * item.qty).toLocaleString()} EGP
                    </span>
                    <button onClick={() => removeFromCart(idx)} style={{
                      background: 'transparent', border: 'none', cursor: 'pointer',
                      color: 'var(--color-foreground-muted)', padding: 4, display: 'flex',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color='var(--color-error)'}
                    onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color='var(--color-foreground-muted)'}>
                      <Close size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {cartItems.length > 0 && (
          <div style={{ padding: '22px 28px', borderTop: '1px solid var(--color-border)' }}>
            <div style={{
              display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16,
              padding: '12px 16px', background: 'var(--color-igi-bg)', borderRadius: 'var(--rounded-card)',
            }}>
              <Shield size={15} style={{ color: 'var(--color-igi)', flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: 'var(--color-igi)' }}>
                IGI certificate issued within 2 days of purchase</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
              <span style={{ fontSize: 15, color: 'var(--color-foreground-muted)' }}>Subtotal</span>
              <span style={{ fontSize: 20, fontWeight: 700 }}>{subtotal.toLocaleString()} EGP</span>
            </div>
            <a href={`https://wa.me/${WA_PHONE}?text=${waMsg}`} target="_blank" rel="noreferrer"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                width: '100%', padding: '16px', borderRadius: 'var(--rounded-button)',
                background: 'var(--color-brand)', color: '#fff',
                fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 500,
                textDecoration: 'none', marginBottom: 10, transition: 'background 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background='var(--color-brand-dark)'}
              onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background='var(--color-brand)'}>
              Complete via WhatsApp <ArrowRight size={16} />
            </a>
            <p style={{ margin: 0, textAlign: 'center', fontSize: 12, color: 'var(--color-foreground-muted)' }}>
              Free insured delivery · Cairo · Visa · InstaPay</p>
          </div>
        )}
      </div>
    </>
  );
}
