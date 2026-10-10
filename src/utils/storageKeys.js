// Single registry of every localStorage key the app owns. Contexts import
// their key from here, and "Reset demo data" (Admin → Settings) clears from
// this list. Adding a persisted store? Add its key here first.

export const STORAGE_KEYS = {
  auth: 'heim_auth_user',
  cart: 'heim_cart_items',
  cartPromo: 'heim_cart_promo',
  wishlist: 'heim_wishlist_items',
  addresses: 'heim_addresses',
  paymentMethods: 'heim_payment_methods',
  orders: 'heim_orders',
  checkoutDraft: 'heim_checkout_draft',
  products: 'heim_products',
  categories: 'heim_categories',
  blogPosts: 'heim_blog_posts',
  idCounters: 'heim_id_counters',
};

// Kept when resetting demo data, so an admin isn't signed out mid-test.
const RESET_PRESERVED_KEYS = [STORAGE_KEYS.auth];

export const getResettableKeys = () =>
  Object.values(STORAGE_KEYS).filter((key) => !RESET_PRESERVED_KEYS.includes(key));