'use client';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Product, ProductVariant } from '@/lib/data';

/**
 * A cart line is a concrete InventoryItem, not a Product.
 *
 * POST /order/orders/create/ consumes InventoryItem IDs
 * (order/api/serializers.py:277-280) — an Item id is rejected. This is why the
 * dedupe key is `inventoryId`: two sizes of the same ring are two lines.
 */
export interface CartItem {
  inventoryId: number;
  productId: string;
  name: string;
  image: string;
  variantLabel: string;
  unitPrice: number;
  qty: number;
  /** Available stock, so quantity can be clamped. */
  maxQty: number;
}

const CART_STORAGE_KEY = 'ga_cart_v1';

interface StoreContextType {
  // Cart
  cartItems: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  cartOpen: boolean;
  addToCart: (variant: ProductVariant, product: Product, qty?: number) => void;
  removeFromCart: (inventoryId: number) => void;
  updateQty: (inventoryId: number, delta: number) => void;
  clearCart: () => void;
  setCartOpen: (open: boolean) => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (id: string) => void;

  // Search
  searchOpen: boolean;
  searchQuery: string;
  setSearchOpen: (open: boolean) => void;
  setSearchQuery: (q: string) => void;

  navigate: (name: string, id?: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

function variantLabel(variant: ProductVariant): string {
  return [variant.colorLabel, variant.sizeLabel].filter(Boolean).join(' · ');
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpenState] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Hydrate after mount, never during render — reading localStorage on the
  // server or the first client render causes a hydration mismatch.
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(CART_STORAGE_KEY);
      if (stored) setCartItems(JSON.parse(stored) as CartItem[]);
    } catch {
      // Corrupt or unavailable storage — start with an empty cart.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    // Must not run before hydration. The initial state is [], so writing on
    // mount would overwrite a stored cart with an empty one — losing the cart
    // for anyone who closes the tab during that window.
    if (!hydrated) return;

    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // Quota or private mode — the cart still works for this session.
    }
  }, [cartItems, hydrated]);

  const setSearchOpen = (open: boolean) => {
    setSearchOpenState(open);
    if (open) setSearchQuery('');
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const cartSubtotal = cartItems.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);

  const addToCart = (variant: ProductVariant, product: Product, qty = 1) => {
    setCartItems((items) => {
      const index = items.findIndex((item) => item.inventoryId === variant.inventoryId);

      if (index >= 0) {
        const updated = [...items];
        const next = Math.min(updated[index].qty + qty, variant.qty);
        updated[index] = { ...updated[index], qty: next };
        return updated;
      }

      return [
        ...items,
        {
          inventoryId: variant.inventoryId,
          productId: product.id,
          name: product.name,
          image: product.img,
          variantLabel: variantLabel(variant),
          unitPrice: variant.price,
          qty: Math.min(qty, variant.qty),
          maxQty: variant.qty,
        },
      ];
    });
    setCartOpen(true);
  };

  const removeFromCart = (inventoryId: number) =>
    setCartItems((items) => items.filter((item) => item.inventoryId !== inventoryId));

  const updateQty = (inventoryId: number, delta: number) =>
    setCartItems((items) => {
      const index = items.findIndex((item) => item.inventoryId === inventoryId);
      if (index < 0) return items;

      const updated = [...items];
      const next = updated[index].qty + delta;

      if (next <= 0) return items.filter((item) => item.inventoryId !== inventoryId);

      updated[index] = { ...updated[index], qty: Math.min(next, updated[index].maxQty) };
      return updated;
    });

  const clearCart = () => setCartItems([]);

  const toggleWishlist = (id: string) =>
    setWishlist((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id]));

  const navigate = (name: string, id?: string) => {
    const href =
      name === 'pdp' && id ? `/products/${id}` :
      name === 'collection' ? '/collection' :
      name === 'wishlist' ? '/wishlist' :
      name === 'account' ? '/account' :
      name === 'cart' ? '/collection' :
      '/';

    router.push(href);
  };

  return (
    <StoreContext.Provider value={{
      cartItems, cartCount, cartSubtotal, cartOpen,
      addToCart, removeFromCart, updateQty, clearCart, setCartOpen,
      wishlist, toggleWishlist,
      searchOpen, searchQuery, setSearchOpen, setSearchQuery,
      navigate,
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
