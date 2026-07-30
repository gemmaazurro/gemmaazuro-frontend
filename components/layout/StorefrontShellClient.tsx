'use client';
import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import PromoBar from './PromoBar';
import Header from './Header';
import CartDrawer from './CartDrawer';
import Footer from './Footer';
import SearchOverlay from './SearchOverlay';
import { useStore } from '@/lib/store';
import type { Branch, ContactDetails, Footer as FooterData, PaymentMethod } from '@/lib/api/cms';

/**
 * The interactive half of the shell.
 *
 * CMS content arrives as props from StorefrontShell (a Server Component) so the
 * chrome is fetched once per render on the server, cached, and never refetched
 * per page from the browser.
 */
export interface StorefrontChrome {
  promoMessages?: string[];
  footer?: FooterData | null;
  paymentMethods?: PaymentMethod[];
  contact?: ContactDetails | null;
  branch?: Branch | null;
  navGroupIds?: number[];
  navPages?: { label: string; href: string }[];
}

export default function StorefrontShellClient({
  children,
  promoMessages,
  footer,
  paymentMethods,
  contact,
  branch,
  navGroupIds,
  navPages,
}: { children: ReactNode } & StorefrontChrome) {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const { cartCount, setCartOpen, setSearchOpen } = useStore();

  return (
    <>
      {!isHome && <PromoBar messages={promoMessages} />}
      <Header
        cartCount={cartCount}
        onCart={() => setCartOpen(true)}
        onSearch={() => setSearchOpen(true)}
        navGroupIds={navGroupIds}
        navPages={navPages}
      />
      {/* Reveal-under-page footer: <main> is solid + higher z-index and covers the footer,
          which sits `position: fixed` at the viewport bottom (lower z-index) the whole time.
          The spacer below adds REAL scroll room equal to the footer's measured height (see
          Footer.tsx's ResizeObserver) — as the user scrolls through it, main's bottom edge
          retreats up the screen and the fixed footer is progressively uncovered underneath. */}
      {/* Header is always `position: fixed` now (Header.tsx) — it no longer occupies flow
          height, so compensate with padding-top (topbar + header on inner pages; home's hero
          is intentionally full-bleed behind the transparent-then-blurred header). */}
      <main style={{
        position: 'relative', zIndex: 1, background: 'var(--color-background)', minHeight: '100vh',
        paddingTop: isHome ? 0 : 'calc(var(--topbar-height) + var(--header-height))',
      }}>
        {children}
      </main>
      <div aria-hidden style={{ height: 'var(--footer-height, 0px)' }} />
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 0 }}>
        <Footer
          footer={footer}
          paymentMethods={paymentMethods}
          contact={contact}
          branch={branch}
        />
      </div>
      <CartDrawer />
      <SearchOverlay />
    </>
  );
}
