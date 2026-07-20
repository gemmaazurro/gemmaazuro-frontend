import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  adaptItem,
  adaptItems,
  derivePricing,
  galleryForColor,
  pickMainImage,
  pickTranslation,
  relatedFrom,
  toGallery,
  toVariants,
  uniqueIds,
} from './adapters';
import type { DjangoItem, DjangoItemImage, DjangoInventoryItem } from './types';

const BACKEND = 'http://localhost:8000';

beforeEach(() => {
  vi.stubEnv('NEXT_PUBLIC_BACKEND_API_URL', BACKEND);
  vi.stubEnv('NEXT_PUBLIC_IMGPROXY_URL', '');
});

function image(overrides: Partial<DjangoItemImage> = {}): DjangoItemImage {
  return {
    id: 1,
    image: '/media/items/images/a.jpeg',
    color: null,
    inventory: null,
    is_main: false,
    position: 0,
    ...overrides,
  };
}

function inventory(overrides: Partial<DjangoInventoryItem> = {}): DjangoInventoryItem {
  return {
    id: 10,
    code: 'GA-1',
    qty: '5.00',
    display_price: '48000.00',
    original_price: '48000.00',
    price: '48000.00',
    discount: '0',
    ...overrides,
  };
}

function item(overrides: Partial<DjangoItem> = {}): DjangoItem {
  return {
    id: 1,
    translations_: {
      en: { name: 'Solitaire Ring', description: 'A single lab diamond.' },
      ar: { name: 'خاتم منفرد', description: 'ألماسة واحدة.' },
    },
    images: [image()],
    inventories: [inventory()],
    subgroups: [3],
    subgroups_: [{ id: 3, translations_: { en: { name: 'Rings' }, ar: { name: 'خواتم' } } }],
    available_colors: [],
    available_sizes: [],
    wishlist: false,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    ...overrides,
  };
}

describe('pickTranslation', () => {
  const translations = {
    en: { name: 'Ring', description: 'EN desc' },
    ar: { name: 'خاتم', description: 'AR desc' },
  };

  it('picks the requested locale', () => {
    expect(pickTranslation(translations, 'ar').name).toBe('خاتم');
    expect(pickTranslation(translations, 'en').name).toBe('Ring');
  });

  it('falls back ar -> en when the arabic translation is empty', () => {
    const partial = { en: { name: 'Ring', description: 'EN' }, ar: { name: '', description: '' } };
    expect(pickTranslation(partial, 'ar').name).toBe('Ring');
  });

  it('returns empty strings rather than throwing when nothing is present', () => {
    expect(pickTranslation(undefined, 'en')).toEqual({ name: '', description: '' });
  });
});

describe('pickMainImage', () => {
  it('prefers is_main over position', () => {
    const url = pickMainImage([
      image({ id: 1, image: '/media/a.jpeg', position: 0, is_main: false }),
      image({ id: 2, image: '/media/b.jpeg', position: 9, is_main: true }),
    ]);
    expect(url).toBe(`${BACKEND}/media/b.jpeg`);
  });

  it('falls back to the lowest position when nothing is is_main', () => {
    const url = pickMainImage([
      image({ id: 1, image: '/media/a.jpeg', position: 5 }),
      image({ id: 2, image: '/media/b.jpeg', position: 2 }),
    ]);
    expect(url).toBe(`${BACKEND}/media/b.jpeg`);
  });

  it('falls back to a placeholder for an item with no images', () => {
    expect(pickMainImage([])).toBe('/assets/hero-pattern.jpeg');
    expect(pickMainImage(undefined)).toBe('/assets/hero-pattern.jpeg');
  });

  it('passes absolute S3 urls through untouched', () => {
    const s3 = 'https://minio.example.com/bucket/items/x.jpeg';
    expect(pickMainImage([image({ image: s3, is_main: true })])).toBe(s3);
  });
});

describe('toGallery', () => {
  it('returns the item OWN images in display order', () => {
    const gallery = toGallery([
      image({ id: 1, image: '/media/a.jpeg', position: 2 }),
      image({ id: 2, image: '/media/b.jpeg', position: 0, is_main: true }),
      image({ id: 3, image: '/media/c.jpeg', position: 1 }),
    ]);

    expect(gallery).toEqual([
      `${BACKEND}/media/b.jpeg`,
      `${BACKEND}/media/c.jpeg`,
      `${BACKEND}/media/a.jpeg`,
    ]);
  });

  it('returns an empty array rather than borrowing other products images', () => {
    expect(toGallery([])).toEqual([]);
  });
});

describe('galleryForColor', () => {
  const images = [
    image({ id: 1, image: '/media/white.jpeg', color: 1, is_main: true }),
    image({ id: 2, image: '/media/rose.jpeg', color: 2 }),
  ];

  it('filters to the selected colour', () => {
    expect(galleryForColor(images, 2)).toEqual([`${BACKEND}/media/rose.jpeg`]);
  });

  it('falls back to the full gallery when a colour has no images', () => {
    expect(galleryForColor(images, 99)).toHaveLength(2);
  });
});

describe('toVariants', () => {
  it('maps the InventoryItem id — the value order create needs', () => {
    const [variant] = toVariants([inventory({ id: 4242 })]);
    expect(variant.inventoryId).toBe(4242);
  });

  it('parses string Decimals into numbers', () => {
    const [variant] = toVariants([
      inventory({ display_price: '1234.56', original_price: '1500.00', qty: '3.00' }),
    ]);

    expect(variant.price).toBe(1234.56);
    expect(variant.originalPrice).toBe(1500);
    expect(variant.qty).toBe(3);
    expect(typeof variant.price).toBe('number');
  });

  it('marks qty <= 0 as out of stock', () => {
    expect(toVariants([inventory({ qty: '0.00' })])[0].inStock).toBe(false);
    expect(toVariants([inventory({ qty: '1.00' })])[0].inStock).toBe(true);
  });

  it('leaves originalPrice null when there is no discount', () => {
    const [variant] = toVariants([
      inventory({ display_price: '100.00', original_price: '100.00' }),
    ]);
    expect(variant.originalPrice).toBeNull();
  });

  it('reads colour and size labels from the nested objects', () => {
    const [variant] = toVariants([
      inventory({
        color_: { id: 2, hexa: '#B76E79', translations_: { en: { name: 'Rose Gold' }, ar: { name: 'وردي' } } },
        size_: { id: 7, translations_: { en: { size: '6.5' }, ar: { size: '6.5' } } },
      }),
    ]);

    expect(variant.colorLabel).toBe('Rose Gold');
    expect(variant.colorHex).toBe('#B76E79');
    expect(variant.sizeLabel).toBe('6.5');
    expect(variant.colorId).toBe(2);
    expect(variant.sizeId).toBe(7);
  });

  it('survives malformed decimals instead of producing NaN', () => {
    const [variant] = toVariants([inventory({ display_price: 'not-a-number' })]);
    expect(variant.price).toBe(0);
    expect(Number.isNaN(variant.price)).toBe(false);
  });
});

describe('derivePricing — the display_price/price inversion', () => {
  it('maps a discounted variant to price=list, salePrice=discounted', () => {
    const variants = toVariants([
      inventory({ display_price: '43200.00', original_price: '48000.00' }),
    ]);

    expect(derivePricing(variants)).toEqual({ price: 48000, salePrice: 43200 });
  });

  it('omits salePrice when list and effective prices match', () => {
    const variants = toVariants([
      inventory({ display_price: '48000.00', original_price: '48000.00' }),
    ]);

    expect(derivePricing(variants)).toEqual({ price: 48000 });
    expect(derivePricing(variants).salePrice).toBeUndefined();
  });

  it('uses the cheapest IN-STOCK variant', () => {
    const variants = toVariants([
      inventory({ id: 1, display_price: '900.00', original_price: '900.00', qty: '0.00' }),
      inventory({ id: 2, display_price: '1000.00', original_price: '1000.00', qty: '5.00' }),
    ]);

    expect(derivePricing(variants).price).toBe(1000);
  });

  it('falls back to the cheapest overall when everything is out of stock', () => {
    const variants = toVariants([
      inventory({ id: 1, display_price: '900.00', original_price: '900.00', qty: '0' }),
      inventory({ id: 2, display_price: '1000.00', original_price: '1000.00', qty: '0' }),
    ]);

    expect(derivePricing(variants).price).toBe(900);
  });

  it('returns zero for an item with no inventories', () => {
    expect(derivePricing([])).toEqual({ price: 0 });
  });
});

describe('adaptItem', () => {
  it('produces the storefront shape', () => {
    const product = adaptItem(item());

    expect(product.id).toBe('1');
    expect(product.name).toBe('Solitaire Ring');
    expect(product.cat).toBe('Rings');
    expect(product.subgroupIds).toEqual([3]);
    expect(product.inStock).toBe(true);
    expect(product.wished).toBe(false);
    expect(product.variants[0].inventoryId).toBe(10);
  });

  it('honours the requested locale throughout', () => {
    const product = adaptItem(item(), 'ar');
    expect(product.name).toBe('خاتم منفرد');
    expect(product.cat).toBe('خواتم');
  });

  it('marks an item with only zero-qty inventories as out of stock', () => {
    const product = adaptItem(item({ inventories: [inventory({ qty: '0' })] }));
    expect(product.inStock).toBe(false);
  });

  it('survives an item with no inventories or images', () => {
    const product = adaptItem(item({ inventories: [], images: [] }));

    expect(product.price).toBe(0);
    expect(product.images).toEqual([]);
    expect(product.img).toBe('/assets/hero-pattern.jpeg');
    expect(product.variants).toEqual([]);
  });

  it('reflects the wishlist flag when present', () => {
    expect(adaptItem(item({ wishlist: true })).wished).toBe(true);
  });
});

// Verified against a live seeded backend — these three quirks are real.
describe('live-backend quirks', () => {
  it('accepts prices as JSON numbers, not just strings', () => {
    const [variant] = toVariants([
      inventory({ display_price: 43200.0 as never, original_price: 48000.0 as never }),
    ]);

    expect(variant.price).toBe(43200);
    expect(variant.originalPrice).toBe(48000);
  });

  it('falls back to the subgroups PK list when subgroups_ is absent', () => {
    // List responses omit subgroups_ despite it being declared on the serializer.
    const product = adaptItem(item({ subgroups: [3, 7], subgroups_: undefined }));

    expect(product.subgroupIds).toEqual([3, 7]);
    expect(product.cat).toBe('');
  });

  it('prefers nested subgroups_ for the category name when present', () => {
    const product = adaptItem(
      item({ subgroups: [3], subgroups_: [{ id: 3, name: 'Rings' }] }),
    );

    expect(product.cat).toBe('Rings');
    expect(product.subgroupIds).toEqual([3]);
  });

  it('dedupes the subgroups PK list the backend does not dedupe', () => {
    const product = adaptItem(item({ subgroups: [3, 3, 3, 7], subgroups_: undefined }));
    expect(product.subgroupIds).toEqual([3, 7]);
  });

  it('dedupes available_colors / available_sizes via uniqueIds', () => {
    expect(uniqueIds([1, 1, 1, 3, 3])).toEqual([1, 3]);
    expect(uniqueIds(undefined)).toEqual([]);
  });
});

describe('adaptItems', () => {
  it('unwraps the DRF pagination envelope', () => {
    const products = adaptItems({
      count: 2,
      next: null,
      previous: null,
      results: [item({ id: 1 }), item({ id: 2 })],
    });

    expect(products.map((p) => p.id)).toEqual(['1', '2']);
  });

  it('also accepts a bare array', () => {
    expect(adaptItems([item({ id: 5 })])).toHaveLength(1);
  });
});

describe('relatedFrom', () => {
  it('returns products sharing a subgroup, excluding itself', () => {
    const all = adaptItems([
      item({ id: 1, subgroups_: [{ id: 3, name: 'Rings' }] }),
      item({ id: 2, subgroups_: [{ id: 3, name: 'Rings' }] }),
      item({ id: 3, subgroups_: [{ id: 9, name: 'Necklaces' }] }),
    ]);

    const related = relatedFrom(all, all[0]);
    expect(related.map((p) => p.id)).toEqual(['2']);
  });

  it('respects the limit', () => {
    const all = adaptItems(
      [1, 2, 3, 4, 5, 6].map((id) => item({ id, subgroups_: [{ id: 3, name: 'Rings' }] })),
    );

    expect(relatedFrom(all, all[0], 2)).toHaveLength(2);
  });
});
