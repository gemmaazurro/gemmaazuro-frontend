// Every backend path, spelled once.
//
// The Django URLconf contains two typos that are load-bearing in the public
// contract and cannot be fixed without breaking the dashboard:
//   - `/products/prouduct/`  (products/urls.py:4)
//   - `/pages/api/polices/`  (pages/urls.py)
// Containing them here means no other file has to know.

export const ENDPOINTS = {
  // Catalog
  ITEMS: '/products/prouduct/items/',
  ITEM: (id: string | number) => `/products/prouduct/items/${id}/`,
  GROUPS: '/products/prouduct/groups/',
  GROUP_TYPES: '/products/prouduct/group_types/',
  SUBGROUPS: '/products/prouduct/subgroups/',
  COLORS: '/products/prouduct/color/',
  SIZES: '/products/prouduct/size/',
  STORE_CONFIG: '/products/prouduct/store-config/',

  // Wishlist (authenticated)
  WISHLIST: '/products/prouduct/wishlist/',
  WISHLIST_TOGGLE: '/products/prouduct/wishlist/toggle/',

  // Auth
  LOGIN: '/accounts/account/login/',
  SIGNUP: '/accounts/account/signup/',
  SEND_OTP: '/accounts/account/send-otp/',
  VERIFY_OTP: '/accounts/account/verify-otp/',
  GOOGLE_LOGIN: '/accounts/account/google-login/',
  USER_DETAIL: '/accounts/account/user-detail/',
  UPDATE_PROFILE: '/accounts/account/update-profile/',

  // Orders
  ORDER_CREATE: '/order/orders/create/',
  ORDERS: '/order/orders/orders/',
  ORDER: (id: string | number) => `/order/orders/orders/${id}/`,
  SHIPPING_METHODS: '/order/orders/shipping_methods/',
  COUNTRIES: '/order/orders/country/',
  CITIES: '/order/orders/city/',
  COUNTRY_CITIES: '/order/orders/country_cities/',
  PROMO_VALIDATE: '/order/orders/promo_codes/validate/',
  UPDATE_PAYMENT_STATUS: '/order/orders/orders/update-payment-status/',
  SHIPPING_ADDRESS: '/order/orders/shipping_address/',

  // CMS — home
  NAV: '/home/api/nav/',
  HERO: '/home/api/hero/',
  FOOTER: '/home/api/footer/',
  PAYMENT_METHODS: '/home/api/payment_methods/',
  HOME_GALLERY_SUBGROUPS: '/home/api/home-gallery-subgroups/',

  // CMS — pages
  ANNOUNCEMENT: '/pages/api/announcement/',
  FAQ: '/pages/api/faq/',
  ABOUT_US: '/pages/api/about_us/',
  CONTACT_US: '/pages/api/contact_us/',
  BRANCH: '/pages/api/branch/',
  POLICIES: '/pages/api/polices/',
  SIZE_CHART: '/pages/api/size_chart/',
  BLOG: '/pages/api/blog/',
} as const;
