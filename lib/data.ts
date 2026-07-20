/** A single purchasable InventoryItem — one colour/size combination. */
export interface ProductVariant {
  /**
   * The Django InventoryItem PK. This is what POST /order/orders/create/
   * consumes (order/api/serializers.py:277-280) — an Item id will be rejected.
   */
  inventoryId: number;
  code: string;
  colorId: number | null;
  colorLabel: string | null;
  colorHex: string | null;
  sizeId: number | null;
  sizeLabel: string | null;
  /** Effective (post-discount) price. */
  price: number;
  /** List price, present only when this variant is on sale. */
  originalPrice: number | null;
  /** Percentage, not a fraction (products/models.py:425). */
  discount: number;
  qty: number;
  inStock: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  cat: string;
  /** Main image (is_main, then lowest position). */
  img: string;
  /** The item's own gallery, in display order. */
  images: string[];
  meta: string;
  price: number;
  salePrice?: number;
  variants: ProductVariant[];
  subgroupIds: number[];
  inStock: boolean;
  wished: boolean;

  // ---------------------------------------------------------------------
  // Commented out: no backend field. Restore if products.Item gains these.
  //
  // There is no review system in the Django schema, and per-stone
  // certification data lives on the ERP mirror tables (Fd2/Fdn6/Ft5) behind a
  // GenericForeignKey rather than on the product itself.
  // ---------------------------------------------------------------------
  // rating: number;
  // reviews: number;
  // igi: string;
  // stone: string;
  // carat: string;
  // cut: string;
  // color: string;
  // clarity: string;
  // cert: string;
}
