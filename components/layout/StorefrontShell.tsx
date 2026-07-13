'use client';
import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import PromoBar from './PromoBar';
import Header from './Header';
import CartDrawer from './CartDrawer';
import Footer from './Footer';
import SearchOverlay from './SearchOverlay';
import { useStore } from '@/lib/store';

export default function StorefrontShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const { cartCount, setCartOpen, setSearchOpen } = useStore();

  return (
    <>
      {!isHome && <PromoBar />}
      <Header
        cartCount={cartCount}
        onCart={() => setCartOpen(true)}
        onSearch={() => setSearchOpen(true)}
      />
      {/* Reveal-under-page footer: <main> is solid + higher z-index and covers the footer,
          which sits `position: fixed` at the viewport bottom (lower z-index) the whole time.
          The spacer below adds REAL scroll room equal to the footer's measured height (see
          Footer.tsx's ResizeObserver) — as the user scrolls through it, main's bottom edge
          retreats up the screen and the fixed footer is progressively uncovered underneath. */}
      <main style={{ position: 'relative', zIndex: 1, background: 'var(--color-background)', minHeight: '100vh' }}>
        {children}
      </main>
      <div aria-hidden style={{ height: 'var(--footer-height, 0px)' }} />
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 0 }}>
        <Footer />
      </div>
      <CartDrawer />
      <SearchOverlay />
    </>
  );
}
