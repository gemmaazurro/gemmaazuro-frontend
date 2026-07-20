import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { act, render, screen, waitFor } from '@testing-library/react';
import { StoreProvider, useStore } from './store';
import type { Product, ProductVariant } from './data';

// next/navigation is not available outside the Next runtime.
import { vi } from 'vitest';
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }));

const CART_KEY = 'ga_cart_v1';

function variant(overrides: Partial<ProductVariant> = {}): ProductVariant {
  return {
    inventoryId: 10,
    code: 'GA-1',
    colorId: 1,
    colorLabel: 'White Gold',
    colorHex: '#E8E8E8',
    sizeId: 3,
    sizeLabel: '6',
    price: 43200,
    originalPrice: 48000,
    discount: 10,
    qty: 5,
    inStock: true,
    ...overrides,
  };
}

const product: Product = {
  id: '1',
  name: 'Solitaire Lab Diamond Ring',
  description: 'A single lab diamond.',
  cat: 'Rings',
  img: '/media/a.jpeg',
  images: ['/media/a.jpeg'],
  meta: 'White Gold · Size 6',
  price: 48000,
  salePrice: 43200,
  variants: [],
  subgroupIds: [1],
  inStock: true,
  wished: false,
};

let store: ReturnType<typeof useStore>;

function Probe() {
  store = useStore();
  return <div data-testid="count">{store.cartCount}</div>;
}

function renderStore() {
  return render(
    <StoreProvider>
      <Probe />
    </StoreProvider>,
  );
}

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  window.localStorage.clear();
});

describe('cart lines are InventoryItems', () => {
  it('adds a variant and stores its inventoryId', async () => {
    renderStore();
    await act(async () => store.addToCart(variant(), product));

    expect(store.cartItems).toHaveLength(1);
    expect(store.cartItems[0].inventoryId).toBe(10);
    expect(store.cartItems[0].productId).toBe('1');
    expect(store.cartItems[0].unitPrice).toBe(43200);
  });

  // The core regression this refactor exists for.
  it('two sizes of one product are two distinct lines', async () => {
    renderStore();
    await act(async () => {
      store.addToCart(variant({ inventoryId: 10, sizeId: 3, sizeLabel: '6' }), product);
      store.addToCart(variant({ inventoryId: 11, sizeId: 4, sizeLabel: '6.5' }), product);
    });

    expect(store.cartItems).toHaveLength(2);
    expect(store.cartItems[0].inventoryId).not.toBe(store.cartItems[1].inventoryId);
    expect(store.cartItems[0].productId).toBe(store.cartItems[1].productId);
  });

  it('merges a repeat add of the same inventory', async () => {
    renderStore();
    await act(async () => {
      store.addToCart(variant(), product);
      store.addToCart(variant(), product);
    });

    expect(store.cartItems).toHaveLength(1);
    expect(store.cartItems[0].qty).toBe(2);
  });

  it('clamps quantity to available stock', async () => {
    renderStore();
    await act(async () => store.addToCart(variant({ qty: 2 }), product, 5));
    expect(store.cartItems[0].qty).toBe(2);

    await act(async () => store.updateQty(10, 10));
    expect(store.cartItems[0].qty).toBe(2);
  });

  it('removes a line when quantity drops to zero', async () => {
    renderStore();
    await act(async () => store.addToCart(variant(), product));
    await act(async () => store.updateQty(10, -1));

    expect(store.cartItems).toHaveLength(0);
  });

  it('computes the subtotal from unit prices', async () => {
    renderStore();
    await act(async () => {
      store.addToCart(variant({ inventoryId: 10, price: 1000 }), product);
      store.addToCart(variant({ inventoryId: 11, price: 500 }), product, 2);
    });

    expect(store.cartSubtotal).toBe(1000 + 500 * 2);
  });
});

describe('persistence', () => {
  it('writes the cart to localStorage', async () => {
    renderStore();
    await act(async () => store.addToCart(variant(), product));

    await waitFor(() => {
      const stored = JSON.parse(window.localStorage.getItem(CART_KEY) ?? '[]');
      expect(stored).toHaveLength(1);
    });
  });

  it('restores a stored cart on mount', async () => {
    window.localStorage.setItem(
      CART_KEY,
      JSON.stringify([
        {
          inventoryId: 99,
          productId: '1',
          name: 'Stored Ring',
          image: '/media/a.jpeg',
          variantLabel: 'White Gold · 6',
          unitPrice: 1000,
          qty: 2,
          maxQty: 5,
        },
      ]),
    );

    renderStore();

    await waitFor(() => expect(store.cartItems).toHaveLength(1));
    expect(store.cartItems[0].inventoryId).toBe(99);
    expect(screen.getByTestId('count').textContent).toBe('2');
  });

  /**
   * Regression: the persist effect used to run on mount with the initial empty
   * state, wiping a stored cart before hydration restored it. Closing the tab
   * in that window lost the cart.
   */
  it('does not clobber a stored cart before hydration completes', async () => {
    const stored = JSON.stringify([
      {
        inventoryId: 99,
        productId: '1',
        name: 'Stored Ring',
        image: '/media/a.jpeg',
        variantLabel: 'White Gold · 6',
        unitPrice: 1000,
        qty: 1,
        maxQty: 5,
      },
    ]);
    window.localStorage.setItem(CART_KEY, stored);

    renderStore();

    // localStorage must never transiently become '[]'.
    expect(JSON.parse(window.localStorage.getItem(CART_KEY) ?? '[]')).toHaveLength(1);

    await waitFor(() => expect(store.cartItems).toHaveLength(1));
    expect(JSON.parse(window.localStorage.getItem(CART_KEY) ?? '[]')).toHaveLength(1);
  });

  it('survives corrupt stored data instead of throwing', async () => {
    window.localStorage.setItem(CART_KEY, '{not json');
    renderStore();

    await waitFor(() => expect(store.cartItems).toEqual([]));
  });
});
