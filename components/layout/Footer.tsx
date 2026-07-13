'use client';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { Instagram, TikTok, Pin, Phone, Clock, ArrowRight } from '@/components/core/Icons';

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  // Computed client-side only — `new Date()` during prerender/SSR trips Cache Components'
  // non-deterministic-value check (no Suspense boundary above this client component).
  const [year, setYear] = useState<number | null>(null);
  useEffect(() => setYear(new Date().getFullYear()), []);

  // Publish the real rendered footer height as a CSS var — StorefrontShell uses it to size
  // a transparent spacer (real extra scroll room) so the fixed, lower-z-index footer reveals
  // itself as <main>'s solid, higher-z-index background scrolls up past it.
  //
  // HARD CONSTRAINT: this reveal only works while footer height <= viewport height. The footer
  // is `position: fixed; bottom: 0`, so anything taller than the viewport has its top edge
  // pushed ABOVE the screen (top = viewportH - footerH, negative) and is permanently
  // unreachable — no amount of scrolling can bring it back. That's exactly what happened on
  // mobile: the desktop 4-column footer stacked into one ~1090px tower inside a ~700px
  // viewport, so its top third (logo, Shop heading) was clipped off forever. Hence the compact
  // mobile layout below — it exists to keep the footer inside one screen, not just to look neat.
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
      <h4 className="ga-f-h4">{title}</h4>
      <ul className="ga-f-list">
        {items.map(item => (
          <li key={item}><a href="#" className="ga-f-link">{item}</a></li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer ref={footerRef} className="ga-footer">
      <style>{`
        .ga-footer {
          background: var(--color-footer-bg);
          color: var(--color-footer-text);
          border-start-start-radius: var(--border-radius);
          border-start-end-radius: var(--border-radius);
          padding: 88px 0 0;
        }
        .ga-footer-inner {
          max-width: var(--page-width);
          margin: 0 auto;
          padding: 0 clamp(20px, 3vw, 40px);
        }
        .ga-footer-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr 1.4fr;
          grid-template-areas: "brand shop house contact";
          gap: clamp(28px, 4vw, 64px);
          padding-bottom: 64px;
        }
        .ga-f-brand   { grid-area: brand; }
        .ga-f-shop    { grid-area: shop; }
        .ga-f-house   { grid-area: house; }
        .ga-f-contact { grid-area: contact; }

        .ga-f-h4 {
          margin: 0 0 18px; font-family: var(--font-heading); font-weight: 500; font-size: 12px;
          letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,255,255,0.45);
        }
        .ga-f-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px; }
        .ga-f-link { color: rgba(255,255,255,0.78); text-decoration: none; font-size: 14px; transition: color 0.2s ease; }
        .ga-f-link:hover { color: #fff; }

        .ga-f-social { display: flex; gap: 10px; margin-bottom: 28px; }
        .ga-f-social a {
          width: 40px; height: 40px; border-radius: 9999px;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid rgba(255,255,255,0.18); color: rgba(255,255,255,0.75);
          transition: border-color 0.2s, color 0.2s; text-decoration: none;
        }
        .ga-f-social a:hover { border-color: rgba(255,255,255,0.6); color: #fff; }

        .ga-f-tagline { margin: 0 0 24px; font-size: 14px; line-height: 1.7; color: rgba(255,255,255,0.62); max-width: 260px; }
        .ga-f-contact-list {
          list-style: none; margin: 0 0 24px; padding: 0; display: flex; flex-direction: column;
          gap: 12px; font-size: 14px; color: rgba(255,255,255,0.75);
        }
        .ga-f-contact-list li { display: flex; gap: 10px; align-items: center; }
        .ga-f-news-label { margin: 0 0 10px; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.4); }
        .ga-f-form { display: flex; gap: 8px; }
        .ga-f-form input {
          flex: 1; min-width: 0; height: 46px; border: 1px solid rgba(255,255,255,0.15);
          border-radius: var(--rounded-input); padding: 0 14px;
          font-family: var(--font-body); font-size: 14px;
          background: rgba(255,255,255,0.07); color: #fff; outline: none;
        }
        .ga-f-form button {
          width: 46px; height: 46px; flex-shrink: 0; border-radius: var(--rounded-input); border: none;
          background: var(--color-brand); color: #fff; cursor: pointer;
          display: flex; align-items: center; justify-content: center; transition: background 0.2s ease;
        }
        .ga-f-form button:hover { background: var(--color-brand-dark); }

        .ga-footer-bottom {
          padding: 22px 0; border-top: 1px solid rgba(255,255,255,0.1);
          display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;
          font-size: 13px; color: rgba(255,255,255,0.45);
        }
        .ga-f-pay { display: flex; gap: 12px; }

        /* ── Mobile ──────────────────────────────────────────────────────────
           Must fit inside ONE viewport or the fixed-position reveal clips the top
           off permanently (see the comment on the height effect above). So: brand
           mark spans full width, Shop + House sit side-by-side using the left/right
           halves instead of stacking into two tall towers, and the rhythm tightens
           throughout. Store hours are dropped here (lowest-value line; address +
           phone carry the same intent in less space). */
        @media (max-width: 767px) {
          .ga-footer { padding-top: 40px; }
          .ga-footer-grid {
            grid-template-columns: 1fr 1fr;
            grid-template-areas:
              "brand   brand"
              "shop    house"
              "contact contact";
            gap: 26px 20px;
            padding-bottom: 26px;
          }
          .ga-f-tagline { display: none; }
          .ga-f-social { margin-bottom: 0; gap: 8px; }
          .ga-f-social a { width: 38px; height: 38px; }
          .ga-f-h4 { margin-bottom: 12px; }
          .ga-f-list { gap: 9px; }
          .ga-f-hours { display: none; }
          .ga-f-contact-list { gap: 9px; margin-bottom: 16px; }
          .ga-footer-bottom {
            padding: 16px 0 22px; justify-content: center; text-align: center;
            flex-direction: column; gap: 8px; font-size: 12px;
          }
        }
      `}</style>

      <div className="ga-footer-inner">
        <div className="ga-footer-grid">
          <div className="ga-f-brand">
            <Image src="/assets/logo-wordmark-white.png" alt="Gemma Azzurro" width={140} height={22}
              style={{ marginBottom: 16, display: 'block' }} />
            <p className="ga-f-tagline">
              Pioneering lab-diamond fine jewelry.<br />Founded in Los Angeles, certified in Cairo.</p>
            <div className="ga-f-social">
              {[Instagram, TikTok, Pin].map((Icon, i) => (
                <a key={i} href="#" aria-label="Gemma Azzurro social"><Icon size={18} /></a>
              ))}
            </div>
          </div>

          <div className="ga-f-shop">{col('Shop', ['Rings', 'Necklaces', 'Bracelets', 'Earrings', 'Piercings'])}</div>
          <div className="ga-f-house">{col('House', ['About Us', 'Returns & Exchange', 'Contact Us', 'Visit Us'])}</div>

          <div className="ga-f-contact">
            <h4 className="ga-f-h4">Visit &amp; Contact</h4>
            <ul className="ga-f-contact-list">
              <li><Pin size={16} style={{ flexShrink: 0 }} /><span>Zamalek, Cairo · Egypt</span></li>
              <li><Phone size={16} style={{ flexShrink: 0 }} /><span>+20 100 000 0000</span></li>
              <li className="ga-f-hours"><Clock size={16} style={{ flexShrink: 0 }} /><span>Daily · 11:00 – 22:00</span></li>
            </ul>
            <p className="ga-f-news-label">Early access &amp; private viewings</p>
            <form onSubmit={e => e.preventDefault()} className="ga-f-form">
              <input placeholder="Email address" aria-label="Email address" />
              <button type="submit" aria-label="Subscribe"><ArrowRight size={18} /></button>
            </form>
          </div>
        </div>

        <div className="ga-footer-bottom">
          <span>&copy; {year ?? ''} Gemma Azzurro Jewelry — Egypt · Los Angeles</span>
          <span className="ga-f-pay">
            {['Visa', 'InstaPay', 'Cash on Delivery'].map(t => (
              <span key={t}>{t}</span>
            ))}
          </span>
        </div>
      </div>
    </footer>
  );
}
