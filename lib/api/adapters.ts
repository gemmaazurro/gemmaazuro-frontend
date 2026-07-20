// Anti-corruption layer: Django shape -> storefront `Product` shape.
//
// This is the ONLY file that knows what Django returns. Components keep
// consuming `Product`, so ProductCard/CollectionContent/PDP don't care that the
// backend models an Item as a translation map plus a list of InventoryItems.

import { mediaUrl } from './config';
import type {
  DjangoInventoryItem,
  DjangoItem,
  DjangoItemImage,
  DjangoSubGroup,
  Locale,
  Paginated,
} from './types';
import type { Product, ProductVariant } from '../data';

const PLACEHOLDER_IMAGE = '/assets/hero-pattern.jpeg';

/** DRF serializes Decimal as a string; everything downstream wants a number. */
function toNumber(value: string | number | null | undefined): number {
  if (value === null || value === undefined) return 0;
  const parsed = typeof value === 'number' ? value : Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

/**
 * Pick a locale from a parler translations map.
 *
 * Every language is present in the payload regardless of `?lang=`, so this is a
 * pure client-side choice with no extra request. Falls back ar -> en -> ''.
 */
export function pickTranslation(
  translations: Partial<Record<Locale, { name?: string; description?: string }>> | undefined,
  locale: Locale = 'en',
): { name: string; description: string } {
  const preferred = translations?.[locale];
  const fallback = translations?.en;

  return {
    name: preferred?.name || fallback?.name || '',
    description: preferred?.description || fallback?.description || '',
  };
}

function subGroupName(subgroup: DjangoSubGroup, locale: Locale = 'en'): string {
  if (subgroup.translations_) return pickTranslation(subgroup.translations_, locale).name;
  return subgroup.name || '';
}

/** Sort key matching ItemImage.Meta.ordering: is_main desc, position asc. */
function byDisplayOrder(a: DjangoItemImage, b: DjangoItemImage): number {
  if (a.is_main !== b.is_main) return a.is_main ? -1 : 1;
  return a.position - b.position;
}

/** is_main -> lowest position -> first -> placeholder. */
export function pickMainImage(images: DjangoItemImage[] | undefined): string {
  if (!images || images.length === 0) return PLACEHOLDER_IMAGE;
  const sorted = [...images].sort(byDisplayOrder);
  return mediaUrl(sorted[0].image) || PLACEHOLDER_IMAGE;
}

/**
 * The item's OWN images, in display order.
 *
 * Replaces the previous fake gallery, which padded thumbs with other products'
 * photos (app/products/[id]/page.tsx:72-76).
 */
export function toGallery(images: DjangoItemImage[] | undefined): string[] {
  if (!images || images.length === 0) return [];
  return [...images].sort(byDisplayOrder).map((image) => mediaUrl(image.image)).filter(Boolean);
}

/** Images for one colour, so the PDP can swap the gallery on variant change. */
export function galleryForColor(
  images: DjangoItemImage[] | undefined,
  colorId: number | null,
): string[] {
  if (!images || colorId === null) return toGallery(images);
  const matching = images.filter((image) => image.color === colorId);
  return matching.length > 0 ? toGallery(matching) : toGallery(images);
}

export function toVariants(
  inventories: DjangoInventoryItem[] | undefined,
  locale: Locale = 'en',
): ProductVariant[] {
  if (!inventories) return [];

  return inventories.map((inventory) => {
    const qty = toNumber(inventory.qty);
    const price = toNumber(inventory.display_price);
    const original = toNumber(inventory.original_price);

    const colorLabel = inventory.color_
      ? inventory.color_.translations_
        ? pickTranslation(inventory.color_.translations_ as never, locale).name
        : inventory.color_.name || null
      : null;

    const sizeLabel = inventory.size_
      ? inventory.size_.translations_?.[locale]?.size ||
        inventory.size_.translations_?.en?.size ||
        inventory.size_.size ||
        null
      : null;

    return {
      // This is what POST /order/orders/create/ consumes — not the Item id.
      inventoryId: inventory.id,
      code: inventory.code || '',
      colorId: inventory.color_?.id ?? inventory.color ?? null,
      colorLabel,
      colorHex: inventory.color_?.hexa ?? null,
      sizeId: inventory.size_?.id ?? inventory.size ?? null,
      sizeLabel,
      price,
      originalPrice: original > price ? original : null,
      discount: toNumber(inventory.discount),
      qty,
      inStock: qty > 0,
    };
  });
}

/**
 * Collapse variants into the card-level price.
 *
 * Note the inversion: Django's `display_price` is the DISCOUNTED number, while
 * the storefront's `price` field means the LIST price with `salePrice` below it.
 * Cheapest in-stock variant wins so the grid shows a "from" price that is
 * actually purchasable.
 */
export function derivePricing(variants: ProductVariant[]): {
  price: number;
  salePrice?: number;
} {
  if (variants.length === 0) return { price: 0 };

  const candidates = variants.filter((variant) => variant.inStock);
  const pool = candidates.length > 0 ? candidates : variants;
  const cheapest = pool.reduce((low, v) => (v.price < low.price ? v : low), pool[0]);

  if (cheapest.originalPrice && cheapest.originalPrice > cheapest.price) {
    return { price: cheapest.originalPrice, salePrice: cheapest.price };
  }

  return { price: cheapest.price };
}

/** Human-readable variant summary; there is no backend `meta` field. */
function buildMeta(variants: ProductVariant[], subgroup: string): string {
  const colors = [...new Set(variants.map((v) => v.colorLabel).filter(Boolean))];
  const sizes = [...new Set(variants.map((v) => v.sizeLabel).filter(Boolean))];

  const parts: string[] = [];
  if (colors.length > 0) parts.push(colors.length === 1 ? colors[0]! : `${colors.length} finishes`);
  if (sizes.length > 1) parts.push(`${sizes.length} sizes`);
  else if (sizes.length === 1) parts.push(`Size ${sizes[0]}`);
  if (parts.length === 0 && subgroup) parts.push(subgroup);

  return parts.join(' · ');
}

/** The backend does not dedupe these — see DjangoItem.available_colors. */
export function uniqueIds(ids: number[] | undefined): number[] {
  return [...new Set(ids ?? [])];
}

export function adaptItem(item: DjangoItem, locale: Locale = 'en'): Product {
  const { name, description } = pickTranslation(item.translations_, locale);
  const variants = toVariants(item.inventories, locale);
  const gallery = toGallery(item.images);

  // `subgroups_` is declared on the list serializer but verified absent from
  // live responses, so the PK list is the reliable source. Use the nested
  // objects only for the display name, when they happen to be there.
  const nested = item.subgroups_ ?? [];
  const subgroupIds = nested.length > 0 ? nested.map((s) => s.id) : uniqueIds(item.subgroups);
  const cat = nested.length > 0 ? subGroupName(nested[0], locale) : '';

  return {
    id: String(item.id),
    name,
    description,
    cat,
    img: pickMainImage(item.images),
    images: gallery,
    meta: buildMeta(variants, cat),
    ...derivePricing(variants),
    variants,
    subgroupIds,
    inStock: variants.some((variant) => variant.inStock),
    wished: item.wishlist === true,
  };
}

export function adaptItems(
  page: Paginated<DjangoItem> | DjangoItem[],
  locale: Locale = 'en',
): Product[] {
  const items = Array.isArray(page) ? page : page.results;
  return items.map((item) => adaptItem(item, locale));
}

/** Related products: shares a subgroup, excluding the product itself. */
export function relatedFrom(all: Product[], current: Product, limit = 4): Product[] {
  const ids = new Set(current.subgroupIds);
  return all
    .filter((product) => product.id !== current.id)
    .filter((product) => product.subgroupIds.some((id) => ids.has(id)))
    .slice(0, limit);
}
