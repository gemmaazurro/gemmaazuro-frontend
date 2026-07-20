// DTOs mirroring the Django wire format verbatim.
//
// Deliberately ugly: field names, the trailing-underscore convention, and
// Decimal-as-string are all reproduced exactly as DRF emits them. Nothing here
// is cleaned up — that is lib/api/adapters.ts's job, and keeping the two
// separate is what stops backend shape leaking into components.

/** DRF pagination envelope. `GET /items/` returns this, not a bare array. */
export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export type Locale = 'en' | 'ar';

/** django-parler emits every configured language, regardless of ?lang=. */
export interface DjangoTranslations {
  en: { name: string; description: string };
  ar: { name: string; description: string };
}

export interface DjangoColor {
  id: number;
  hexa: string;
  translations_?: Record<Locale, { name: string }>;
  name?: string;
}

export interface DjangoSize {
  id: number;
  translations_?: Record<Locale, { size: string }>;
  size?: string;
}

export interface DjangoItemImage {
  id: number;
  image: string;
  color: number | null;
  color_details?: DjangoColor | null;
  inventory: number | null;
  is_main: boolean;
  position: number;
}

/**
 * DRF is inconsistent about Decimals here, verified against a live response:
 * `qty` and `discount` serialize as strings, but `display_price` /
 * `original_price` come back as JSON numbers (they are SerializerMethodFields
 * returning Decimal, not DecimalFields). Accept both and normalize in the
 * adapter.
 */
export type DjangoDecimal = string | number;

export interface DjangoInventoryItem {
  id: number;
  code: string | null;
  qty: DjangoDecimal;
  /** Post-discount price. */
  display_price: DjangoDecimal;
  /** Pre-discount price. */
  original_price: DjangoDecimal;
  price: DjangoDecimal;
  discount: DjangoDecimal;
  size?: number | null;
  color?: number | null;
  size_?: DjangoSize | null;
  color_?: DjangoColor | null;
  translations_?: DjangoTranslations;
}

export interface DjangoSubGroup {
  id: number;
  translations_?: Record<Locale, { name: string }>;
  name?: string;
  group?: number;
  group_name?: string;
  group_type?: number;
  group_type_name?: string;
  image?: string | null;
}

export interface DjangoGroup {
  id: number;
  translations_?: Record<Locale, { name: string }>;
  name?: string;
  image?: string | null;
}

export interface DjangoItem {
  id: number;
  translations_: DjangoTranslations;
  images: DjangoItemImage[];
  inventories: DjangoInventoryItem[];
  subgroups: number[];
  /**
   * OPTIONAL: declared in ListItemSerializer.Meta.fields but verified absent
   * from live `GET /items/` responses. Present on the detail serializer. Always
   * fall back to the `subgroups` PK list.
   */
  subgroups_?: DjangoSubGroup[];
  /**
   * NOT deduplicated by the backend -- `_listing_inventories_qs` applies
   * .order_by("id") before .distinct(), which defeats DISTINCT in SQL. Comes
   * back as [1,1,1,1,1,1,2,2,...]. Dedupe on read.
   */
  available_colors: number[];
  available_sizes: number[];
  /** User-scoped. Always false in anonymous (cached) reads — see L4 notes. */
  wishlist: boolean;
  created_at: string;
  updated_at: string;
}

export interface DjangoStoreConfig {
  id: number;
  online_purchasing_enabled: boolean;
  in_store_only_message_en: string;
  in_store_only_message_ar: string;
}
