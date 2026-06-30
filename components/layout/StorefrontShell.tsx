'use client';
import { ReactNode } from 'react';
import PromoBar from './PromoBar';
import Header from './Header';
import CartDrawer from './CartDrawer';
import Footer from './Footer';
import SearchOverlay from './SearchOverlay';
import { useStore } from '@/lib/store';

export default function StorefrontShell({ children }: { children: ReactNode }) {
  const { cartCount, setCartOpen, setSearchOpen } = useStore();

  return (
    <>
      <PromoBar />
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
