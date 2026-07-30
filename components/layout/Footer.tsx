'use client';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { Instagram, TikTok, Pin, Phone, Clock, ArrowRight } from '@/components/core/Icons';
import { WA_PHONE } from '@/lib/contact';
import { pageHref } from '@/lib/api/page-routes';
import type { Branch, ContactDetails, Footer as FooterData, PaymentMethod } from '@/lib/api/cms';

interface FooterProps {
  footer?: FooterData | null;
  paymentMethods?: PaymentMethod[];
  contact?: ContactDetails | null;
  /** First branch only — the footer has room for one address. */
  branch?: Branch | null;
}

export default function Footer({
  footer = null,
  paymentMethods = [],
  contact = null,
  branch = null,
}: FooterProps) {
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

  const col = (title: string, items: { label: string; href: string }[]) => (
    <div>
      <h4 className="ga-f-h4">{title}</h4>
      <ul className="ga-f-list">
        {items.map(item => (
          <li key={`${item.label}-${item.href}`}>
            <a href={item.href} className="ga-f-link">{item.label}</a>
          </li>
        ))}
      </ul>
    </div>
  );

  // Every link below resolves to a real route. Where the CMS has nothing yet we
  // fall back to routes that exist — never to "#".
  const shopItems = footer?.section2_subgroups?.length
    ? footer.section2_subgroups.map((subgroup) => ({
        label: subgroup.name,
        href: `/collection?subgroup=${subgroup.id}`,
      }))
    : [{ label: 'All Jewelry', href: '/collection' }];

  const houseItems = footer?.section1_pages?.length
    ? footer.section1_pages.map((page) => ({ label: page.title, href: pageHref(page.slug) }))
    : [
        { label: 'About Us', href: '/about-us' },
        { label: 'Policies', href: '/policies' },
        { label: 'Contact Us', href: '/contact-us' },
        { label: 'Visit Us', href: '/branches' },
      ];

  // Only render a social circle when there is somewhere to send people. The
  // map pin points at the branch location, which is a real destination too.
  const socials: { Icon: typeof Instagram; href: string; label: string }[] = [
    footer?.instagram_link && { Icon: Instagram, href: footer.instagram_link, label: 'Instagram' },
    footer?.tiktok_link && { Icon: TikTok, href: footer.tiktok_link, label: 'TikTok' },
    branch?.location && { Icon: Pin, href: branch.location, label: 'Find us' },
  ].filter(Boolean) as { Icon: typeof Instagram; href: string; label: string }[];

  const addressLine = [branch?.area, branch?.address].filter(Boolean).join(' · ');
  const phoneLine = contact?.phone || contact?.whatsapp || null;
  const payMethods = paymentMethods.length
    ? paymentMethods.map((method) => method.name)
    : ['Visa', 'InstaPay', 'Cash on Delivery'];

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
          .ga-footer { padding-top: 24px; }
          .ga-footer-grid {
            grid-template-columns: 1fr 1fr;
            grid-template-areas:
              "brand   brand"
              "shop    house"
              "contact contact";
            gap: 18px 20px;
            padding-bottom: 16px;
          }
          .ga-f-tagline { display: none; }
          .ga-f-social { margin-bottom: 0; gap: 8px; }
          .ga-f-social a { width: 34px; height: 34px; }
          .ga-f-h4 { margin-bottom: 8px; }
          .ga-f-list { gap: 7px; }
          .ga-f-hours { display: none; }
          .ga-f-contact-list { gap: 7px; margin-bottom: 12px; }
          .ga-footer-bottom {
            padding: 12px 0 16px; justify-content: center; text-align: center;
            flex-direction: column; gap: 6px; font-size: 12px;
          }
        }
      `}</style>

      <div className="ga-footer-inner">
        <div className="ga-footer-grid">
          <div className="ga-f-brand">
            <Image src="/assets/logo-wordmark-white.png" alt="Gemma Azzurro" width={140} height={22}
              style={{ marginBottom: 16, display: 'block' }} />
            <p className="ga-f-tagline">
              {footer?.description?.trim() || (
                <>Pioneering lab-diamond fine jewelry.<br />Founded in Los Angeles, certified in Cairo.</>
              )}
            </p>
            {socials.length > 0 && (
              <div className="ga-f-social">
                {socials.map(({ Icon, href, label }) => (
                  <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}>
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="ga-f-shop">{col(footer?.section2_title?.trim() || 'Shop', shopItems)}</div>
          <div className="ga-f-house">{col(footer?.section1_title?.trim() || 'House', houseItems)}</div>

          <div className="ga-f-contact">
            <h4 className="ga-f-h4">Visit &amp; Contact</h4>
            <ul className="ga-f-contact-list">
              {addressLine && (
                <li><Pin size={16} style={{ flexShrink: 0 }} /><span>{addressLine}</span></li>
              )}
              {phoneLine && (
                <li>
                  <Phone size={16} style={{ flexShrink: 0 }} />
                  <a href={`tel:${phoneLine.replace(/[^\d+]/g, '')}`} className="ga-f-link">{phoneLine}</a>
                </li>
              )}
              {branch?.working_hours && (
                <li className="ga-f-hours"><Clock size={16} style={{ flexShrink: 0 }} /><span>{branch.working_hours}</span></li>
              )}
            </ul>
            <p className="ga-f-news-label">{footer?.newsletter_title?.trim() || 'Early access & private viewings'}</p>
            {/*
              There is no subscriber model or newsletter endpoint in the backend,
              so this cannot POST anywhere. Rather than silently swallow the
              address, it hands off to WhatsApp — the same channel the rest of
              the store uses. Wire it to a real endpoint if a list is ever added.
            */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const input = e.currentTarget.elements.namedItem('email') as HTMLInputElement | null;
                const email = input?.value?.trim();
                if (!email) return;

                const text = encodeURIComponent(
                  `Hello, please add me to Gemma Azzurro early access: ${email}`,
                );
                window.open(`https://wa.me/${WA_PHONE}?text=${text}`, '_blank', 'noopener');
                e.currentTarget.reset();
              }}
              className="ga-f-form"
            >
              <input name="email" type="email" required placeholder="Email address" aria-label="Email address" />
              <button type="submit" aria-label="Request early access"><ArrowRight size={18} /></button>
            </form>
          </div>
        </div>

        <div className="ga-footer-bottom">
          <span>&copy; {year ?? ''} Gemma Azzurro Jewelry — Egypt · Los Angeles</span>
          <span className="ga-f-pay">
            {payMethods.map(t => (
              <span key={t}>{t}</span>
            ))}
          </span>
        </div>
      </div>
    </footer>
  );
}
