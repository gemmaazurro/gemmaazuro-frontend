'use client';
import { useState, ReactNode } from 'react';
import PromoBar from './PromoBar';
import Header from './Header';
import CartDrawer from './CartDrawer';
import Footer from './Footer';

export default function StorefrontShell({ children }: { children: ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartCount] = useState(0);
  return (
    <>
      <PromoBar />
      <Header cartCount={cartCount} onCart={() => setCartOpen(true)} />
      <main>{children}</main>
      <Footer />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} count={cartCount} />
    </>
  );
}
