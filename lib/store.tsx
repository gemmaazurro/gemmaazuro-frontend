'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '@/lib/data';

interface CartItem {
  product: Product;
  qty: number;
}

interface StoreContextType {
  // Cart
  cartItems: CartItem[];
  cartCount: number;
  cartOpen: boolean;
  addToCart: (product: Product) => void;
  removeFromCart: (index: number) => void;
  updateQty: (index: number, delta: number) => void;
  setCartOpen: (open: boolean) => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (id: string) => void;

  // Search
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;

  // Route
  route: { name: string; id: string | null };
  navigate: (name: string, id?: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [route, setRoute] = useState({ name: 'home', id: null as string | null });

  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);

  const addToCart = (product: Product) => {
    setCartItems(items => {
      const idx = items.findIndex(i => i.product.id === product.id);
      if (idx >= 0) {
        const u = [...items];
        u[idx] = { ...u[idx], qty: u[idx].qty + 1 };
        return u;
      }
      return [...items, { product, qty: 1 }];
    });
    setCartOpen(true);
  };

  const removeFromCart = (index: number) =>
    setCartItems(items => items.filter((_, i) => i !== index));

  const updateQty = (index: number, delta: number) =>
    setCartItems(items => {
      const u = [...items];
      const nq = u[index].qty + delta;
      if (nq <= 0) return items.filter((_, i) => i !== index);
      u[index] = { ...u[index], qty: nq };
      return u;
    });

  const toggleWishlist = (id: string) =>
    setWishlist(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id]);

  const navigate = (name: string, id?: string) => {
    setRoute({ name, id: id || null });
    window.scrollTo(0, 0);
  };

  return (
    <StoreContext.Provider value={{
      cartItems, cartCount, cartOpen, addToCart, removeFromCart, updateQty, setCartOpen,
      wishlist, toggleWishlist,
      searchOpen, setSearchOpen,
      route, navigate,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
}
