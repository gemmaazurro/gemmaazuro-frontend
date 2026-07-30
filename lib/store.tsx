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
const WISHLIST_STORAGE_KEY = 'ga_wishlist_v1';

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
  /** True once the server list has loaded, so favourites survive a refresh. */
  wishlistSignedIn: boolean;

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
  const [wishlistSignedIn, setWishlistSignedIn] = useState(false);
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

      const storedWishlist = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (storedWishlist) setWishlist(JSON.parse(storedWishlist) as string[]);
    } catch {
      // Corrupt or unavailable storage — start with an empty cart.
    } finally {
      setHydrated(true);
    }
  }, []);

  // Reconcile with the server once we know whether anyone is signed in.
  //
  // Anything favourited while signed out is pushed up, then the server list
  // becomes the truth. Without the push, signing in would silently discard
  // whatever the shopper hearted on the way there.
  useEffect(() => {
    if (!hydrated) return;

    let cancelled = false;

    (async () => {
      try {
        const response = await fetch('/api/wishlist', { cache: 'no-store' });
        if (!response.ok) return;

        const { signedIn, ids } = (await response.json()) as {
          signedIn: boolean;
          ids: string[];
        };

        if (cancelled || !signedIn) return;

        const pending = wishlist.filter((id) => !ids.includes(id));
        await Promise.all(
          pending.map((id) =>
            fetch('/api/wishlist', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ itemId: Number(id) }),
            }).catch(() => null),
          ),
        );

        if (cancelled) return;
        setWishlist([...new Set([...ids, ...pending])]);
        setWishlistSignedIn(true);
      } catch {
        // Offline or backend down — the local list keeps working.
      }
    })();

    return () => {
      cancelled = true;
    };
    // Runs once per hydration; `wishlist` is read as the pending set, not tracked.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

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

  // Mirror the wishlist locally too, even when signed in. It makes the hearts
  // correct on the very first paint after a reload, before /api/wishlist
  // answers, instead of flashing empty.
  useEffect(() => {
    if (!hydrated) return;

    try {
      window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch {
      // Quota or private mode — favourites still work for this session.
    }
  }, [wishlist, hydrated]);

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

  /**
   * Flip the heart immediately, then tell the server.
   *
   * Optimistic on purpose — a heart that waits for a round trip feels broken.
   * If the server rejects it we put the old value back, so the UI never claims
   * something was saved when it was not.
   */
  const toggleWishlist = (id: string) => {
    const wasWished = wishlist.includes(id);
    setWishlist((w) => (wasWished ? w.filter((x) => x !== id) : [...w, id]));

    if (!wishlistSignedIn) return;

    fetch('/api/wishlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId: Number(id) }),
    })
      .then((response) => {
        if (!response.ok) throw new Error('toggle failed');
      })
      .catch(() => {
        setWishlist((w) => (wasWished ? [...w, id] : w.filter((x) => x !== id)));
      });
  };

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
      wishlist, toggleWishlist, wishlistSignedIn,
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
