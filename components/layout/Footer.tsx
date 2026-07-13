'use client';
import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { Instagram, TikTok, Pin, Phone, Clock, ArrowRight } from '@/components/core/Icons';

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  // Publish the real rendered footer height as a CSS var so StorefrontShell can pull
  // <main> up over it by the same amount (the "reveal under the page" sticky trick) —
  // no scroll listener, no JS-driven transform, just CSS sticky + a measured offset.
  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    const setHeight = () => {
      document.documentElement.style.setProperty('--footer-height', `${el.offsetHeight}px`);
    };
    setHeight();
    const ro = new ResizeObserver(setHeight);
    ro.observe(el);
    window.addEventListener('resize', setHeight);
    return () => { ro.disconnect(); window.removeEventListener('resize', setHeight); };
  }, []);

  const col = (title: string, items: string[]) => (
    <div>
      <h4 style={{ margin: '0 0 18px', fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: 12,
        letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)' }}>{title}</h4>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map(item => (
          <li key={item}><a href="#" style={{ color: 'rgba(255,255,255,0.78)', textDecoration: 'none', fontSize: 14,
            transition: 'color 0.2s ease' }}
            onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color='#fff'}
            onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color='rgba(255,255,255,0.78)'}>{item}</a></li>
        ))}
      </ul>
    </div>
  );

  return (
    <div style={{ position: 'sticky', bottom: 0, zIndex: 0 }}>
      <footer ref={footerRef} style={{
        background: 'var(--color-footer-bg)', color: 'var(--color-footer-text)',
        borderStartStartRadius: 'var(--border-radius)', borderStartEndRadius: 'var(--border-radius)',
        padding: '88px 0 0',
      }}>
        <div style={{ maxWidth: 'var(--page-width)', margin: '0 auto', padding: '0 clamp(20px,3vw,40px)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'var(--grid-footer)', gap: 'clamp(28px,4vw,64px)', paddingBottom: 64 }}>
            <div>
              <Image src="/assets/logo-wordmark-white.png" alt="Gemma Azzurro" width={140} height={22}
                style={{ marginBottom: 20, display: 'block' }} />
              <p style={{ margin: '0 0 24px', fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,0.62)', maxWidth: 260 }}>
                Pioneering lab-diamond fine jewelry.<br />Founded in Los Angeles, certified in Cairo.</p>
              <div style={{ display: 'flex', gap: 10, marginBottom: 28, justifyContent: 'var(--footer-social-justify)' as any }}>
                {[Instagram, TikTok, Pin].map((Icon, i) => (
                  <a key={i} href="#" style={{ width: 40, height: 40, borderRadius: 9999,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.75)',
                    transition: 'border-color 0.2s, color 0.2s', textDecoration: 'none' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor='rgba(255,255,255,0.6)'; (e.currentTarget as HTMLAnchorElement).style.color='#fff'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor='rgba(255,255,255,0.18)'; (e.currentTarget as HTMLAnchorElement).style.color='rgba(255,255,255,0.75)'; }}>
                    <Icon size={18} /></a>
                ))}
              </div>
            </div>

            {col('Shop', ['Rings', 'Necklaces', 'Bracelets', 'Earrings', 'Piercings'])}
            {col('House', ['About Us', 'Returns & Exchange', 'Contact Us', 'Visit Us'])}

            <div>
              <h4 style={{ margin: '0 0 18px', fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: 12,
                letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)' }}>Visit & Contact</h4>
              <ul style={{ listStyle: 'none', margin: '0 0 24px', padding: 0, display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14, color: 'rgba(255,255,255,0.75)' }}>
                <li style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}><Pin size={16} style={{ flexShrink: 0, marginTop: 1 }} /><span>Zamalek, Cairo · Egypt</span></li>
                <li style={{ display: 'flex', gap: 10, alignItems: 'center' }}><Phone size={16} /><span>+20 100 000 0000</span></li>
                <li style={{ display: 'flex', gap: 10, alignItems: 'center' }}><Clock size={16} /><span>Daily · 11:00 – 22:00</span></li>
              </ul>
              <p style={{ margin: '0 0 10px', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>Early access & private viewings</p>
              <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', gap: 8 }}>
                <input placeholder="Email address" style={{
                  flex: 1, height: 46, border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 'var(--rounded-input)', padding: '0 14px',
                  fontFamily: 'var(--font-body)', fontSize: 14,
                  background: 'rgba(255,255,255,0.07)', color: '#fff',
                  outline: 'none', transition: 'border-color 0.2s ease' }} />
                <button style={{ width: 46, height: 46, borderRadius: 'var(--rounded-input)', border: 'none',
                  background: 'var(--color-brand)', color: '#fff', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.2s ease' }}
                  onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background='var(--color-brand-dark)'}
                  onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background='var(--color-brand)'}>
                  <ArrowRight size={18} /></button>
              </form>
            </div>
          </div>

          <div style={{
            padding: '22px 0',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            display: 'flex', justifyContent: 'var(--footer-bottom-justify)' as any, flexDirection: 'var(--footer-bottom-flex)' as any, flexWrap: 'wrap', gap: 12,
            fontSize: 13, color: 'rgba(255,255,255,0.45)',
          }}>
            <span>&copy; {new Date().getFullYear()} Gemma Azzurro Jewelry — Egypt · Los Angeles</span>
            <span style={{ display: 'flex', gap: 12, justifyContent: 'var(--footer-social-justify)' as any, width: '100%' }}>
              {['Visa', 'InstaPay', 'Cash on Delivery'].map(t => (
                <span key={t}>{t}</span>
              ))}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
