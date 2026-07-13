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
      {/* position + z-index + negative margin pull main up over the sticky footer below it,
          so the footer reveals underneath as the user scrolls past the end of the page content
          (see Footer.tsx — it publishes --footer-height via ResizeObserver). */}
      <main style={{
        position: 'relative',
        zIndex: 1,
        background: 'var(--color-background)',
        marginBottom: 'calc(-1 * var(--footer-height, 0px))',
      }}>{children}</main>
      <Footer />
      <CartDrawer />
      <SearchOverlay />
    </>
  );
}
