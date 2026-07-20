// Django catalog payloads, verified against a live seeded backend.
//
// Three quirks reproduced deliberately, because hand-written fixtures that
// "look right" would hide them:
//   1. display_price / original_price are JSON NUMBERS, while qty and discount
//      are STRINGS.
//   2. `subgroups_` is absent from list responses (only `subgroups` PKs).
//   3. available_colors / available_sizes are NOT deduplicated.
//
// SOLITAIRE models the list shape; SOLITAIRE_DETAIL adds the nested subgroups_
// the detail endpoint returns.

import type { DjangoItem, Paginated } from '@/lib/api/types';

const WHITE_GOLD = {
  id: 1,
  hexa: '#E8E8E8',
  translations_: { en: { name: 'White Gold' }, ar: { name: 'أبيض ذهبي' } },
};

const ROSE_GOLD = {
  id: 3,
  hexa: '#B76E79',
  translations_: { en: { name: 'Rose Gold' }, ar: { name: 'ذهبي وردي' } },
};

const SIZE_6 = { id: 3, translations_: { en: { size: '6' }, ar: { size: '6' } } };

export const RINGS_SUBGROUP = {
  id: 1,
  group: 1,
  group_name: 'Jewelry',
  translations_: { en: { name: 'Rings' }, ar: { name: 'خواتم' } },
};

export const NECKLACES_SUBGROUP = {
  id: 2,
  group: 1,
  group_name: 'Jewelry',
  translations_: { en: { name: 'Necklaces' }, ar: { name: 'قلادات' } },
};

/** On sale: display_price (43200) is below original_price (48000). */
export const SOLITAIRE: DjangoItem = {
  id: 1,
  translations_: {
    en: {
      name: 'Solitaire Lab Diamond Ring',
      description: 'A single lab-grown diamond in a four-prong setting.',
    },
    ar: { name: 'خاتم الماس منفرد', description: 'ألماسة مزروعة معمليًا.' },
  },
  images: [
    {
      id: 1,
      image: '/media/items/images/8f2a.jpeg',
      color: 1,
      inventory: 10,
      is_main: true,
      position: 0,
    },
    {
      id: 2,
      image: '/media/items/images/9c1b.jpeg',
      color: 3,
      inventory: 11,
      is_main: false,
      position: 1,
    },
    {
      id: 3,
      image: '/media/items/images/7d4e.jpeg',
      color: 1,
      inventory: 10,
      is_main: false,
      position: 2,
    },
  ],
  inventories: [
    {
      id: 10,
      code: 'GA-1-1-6',
      // qty is a string; the prices are numbers. This is really how it comes back.
      qty: '5.00',
      display_price: 43200.0,
      original_price: 48000.0,
      price: 48000.0,
      discount: '10.0000',
      color_: WHITE_GOLD,
      size_: SIZE_6,
    },
    {
      id: 11,
      code: 'GA-1-3-6',
      qty: '2.00',
      display_price: 43200.0,
      original_price: 48000.0,
      price: 48000.0,
      discount: '10.0000',
      color_: ROSE_GOLD,
      size_: SIZE_6,
    },
  ],
  subgroups: [1],
  // No `subgroups_` — list responses omit it.
  // Duplicated exactly as the backend emits them.
  available_colors: [1, 1, 3, 3],
  available_sizes: [3, 3, 3, 3],
  wishlist: false,
  created_at: '2026-07-01T10:00:00Z',
  updated_at: '2026-07-01T10:00:00Z',
};

/** Detail responses carry the nested subgroup objects. */
export const SOLITAIRE_DETAIL: DjangoItem = {
  ...SOLITAIRE,
  subgroups_: [RINGS_SUBGROUP],
};

/** Not on sale, and fully out of stock. */
export const PENDANT: DjangoItem = {
  id: 2,
  translations_: {
    en: { name: 'Drop Pendant Necklace', description: 'A suspended lab diamond.' },
    ar: { name: 'قلادة معلقة', description: 'ألماسة معلقة.' },
  },
  images: [
    {
      id: 4,
      image: '/media/items/images/1a2b.jpeg',
      color: 1,
      inventory: 20,
      is_main: true,
      position: 0,
    },
  ],
  inventories: [
    {
      id: 20,
      code: 'GA-2-1-5',
      qty: '0.00',
      display_price: 27500.0,
      original_price: 27500.0,
      price: 27500.0,
      discount: '0',
      color_: WHITE_GOLD,
      size_: SIZE_6,
    },
  ],
  subgroups: [2],
  available_colors: [1],
  available_sizes: [3],
  wishlist: false,
  created_at: '2026-07-02T10:00:00Z',
  updated_at: '2026-07-02T10:00:00Z',
};

export const ITEMS_PAGE: Paginated<DjangoItem> = {
  count: 2,
  next: null,
  previous: null,
  results: [SOLITAIRE, PENDANT],
};

export const STORE_CONFIG = {
  id: 1,
  online_purchasing_enabled: true,
  in_store_only_message_en: 'Online purchasing is paused.',
  in_store_only_message_ar: 'الشراء عبر الإنترنت متوقف مؤقتًا.',
};
