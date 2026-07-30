/** What Django returns from login / verify-otp / google-login. */
export interface AuthResponse {
  token: string;
  id: number;
  role: string;
  username?: string;
  name?: string;
  full_name?: string;
  email?: string;
  avatar?: string;
  is_new_user?: boolean;
}

/**
 * GET /accounts/account/user-detail/
 *
 * Mirrors UserDetailSerializer exactly. Note there is no `id` — the serializer
 * does not expose one, so don't add it here expecting the API to fill it in.
 */
export interface SessionUser {
  username: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  role: string;
  avatar?: string | null;
  google_connected?: boolean;
}

/** One line of an order, as GET /order/orders/orders/ returns it. */
export interface OrderLine {
  qty: number;
  pre_order: boolean;
  item: {
    id: number;
    code: string | null;
    display_price: string | number;
    translations_?: Record<string, { name: string; description: string }>;
  };
}

export interface Order {
  id: number;
  status: string;
  name: string;
  phone: string;
  total_qty: number;
  total_price: number;
  shipping_fee: string | number;
  promo_code: string | null;
  promo_code_amount: string | number;
  is_payed: boolean;
  has_pre_order: boolean;
  items: OrderLine[];
  created_at: string;
  updated_at: string;
}
