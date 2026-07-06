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
      <main>{children}</main>
      <Footer />
      <CartDrawer />
      <SearchOverlay />
    </>
  );
}
