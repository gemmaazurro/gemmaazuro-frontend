'use client';
import { ReactNode } from 'react';
import PromoBar from './PromoBar';
import Header from './Header';
import CartDrawer from './CartDrawer';
import Footer from './Footer';
import SearchOverlay from './SearchOverlay';
import { StoreProvider, useStore } from '@/lib/store';

function ShellContent({ children }: { children: ReactNode }) {
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

export default function StorefrontShell({ children }: { children: ReactNode }) {
  return (
    <StoreProvider>
      <ShellContent>{children}</ShellContent>
    </StoreProvider>
  );
}
