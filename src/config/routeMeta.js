import { matchPath } from 'react-router';

// Title and description for every route: the ONE place to edit page titles.
// `{name}` is replaced by the store name from Settings. A missing description falls back to the
// store tagline. Product and blog pages override their entry with the product or article
// (see hooks/usePageMeta.js).

export const HOME_TITLE_SUFFIX = 'Modern Furniture Store';

// Not useful in search results: the page gets `noindex`.
const PRIVATE_PREFIXES = ['/admin', '/account', '/checkout', '/cart', '/wishlist', '/signin', '/signup', '/forgot-password'];

const ROUTES = [
  { path: '/', home: true },
  { path: '/shop', title: 'Shop', description: "Browse {name}'s furniture collection: sofas, chairs, tables, beds, lighting and more." },
  { path: '/shop/:id', title: 'Product' },
  { path: '/about', title: 'About Us', description: 'Learn about {name}: our story, values, team and commitment to quality and sustainability.' },
  { path: '/blog', title: 'Blog', description: 'Design inspiration, interior tips and furniture guides from the {name} team.' },
  { path: '/blog/:id', title: 'Article' },
  { path: '/contact', title: 'Contact Us', description: 'Questions about an order or a product? Get in touch with the {name} team.' },
  { path: '/cart', title: 'Shopping Cart' },
  { path: '/wishlist', title: 'Wishlist' },
  { path: '/signin', title: 'Sign In' },
  { path: '/signup', title: 'Create Account' },
  { path: '/forgot-password', title: 'Reset Password' },
  { path: '/faq', title: 'FAQ', description: 'Answers to common questions about delivery, returns, warranties and orders at {name}.' },
  { path: '/shipping', title: 'Shipping', description: 'Delivery times, shipping costs and international shipping at {name}.' },
  { path: '/returns', title: 'Returns', description: 'How returns, refunds and warranty claims work at {name}.' },
  { path: '/track-order', title: 'Track Your Order', description: 'Check the status of your {name} order with your order number and email.' },
  { path: '/privacy', title: 'Privacy Policy', description: 'How {name} collects, uses and protects your personal information.' },
  { path: '/terms', title: 'Terms of Service', description: 'The terms that apply when you use the {name} store and place an order.' },

  { path: '/checkout/account', title: 'Checkout' },
  { path: '/checkout/shipping', title: 'Checkout: Shipping' },
  { path: '/checkout/payment', title: 'Checkout: Payment' },
  { path: '/checkout/review', title: 'Checkout: Review' },
  { path: '/checkout/confirmation/:orderId', title: 'Order Confirmed' },

  { path: '/account/profile', title: 'My Profile' },
  { path: '/account/orders', title: 'My Orders' },
  { path: '/account/orders/:id', title: 'Order Details' },
  { path: '/account/addresses', title: 'My Addresses' },
  { path: '/account/wallet', title: 'My Wallet' },
  { path: '/account/settings', title: 'Account Settings' },

  { path: '/admin', title: 'Admin: Dashboard' },
  { path: '/admin/orders', title: 'Admin: Orders' },
  { path: '/admin/orders/:id', title: 'Admin: Order' },
  { path: '/admin/customers', title: 'Admin: Customers' },
  { path: '/admin/promos', title: 'Admin: Promo codes' },
  { path: '/admin/products', title: 'Admin: Products' },
  { path: '/admin/products/new', title: 'Admin: Add product' },
  { path: '/admin/products/:id/edit', title: 'Admin: Edit product' },
  { path: '/admin/categories', title: 'Admin: Categories' },
  { path: '/admin/blog', title: 'Admin: Blog posts' },
  { path: '/admin/blog/new', title: 'Admin: Add post' },
  { path: '/admin/blog/:id/edit', title: 'Admin: Edit post' },
  { path: '/admin/messages', title: 'Admin: Messages' },
  { path: '/admin/messages/:id', title: 'Admin: Message' },
  { path: '/admin/subscribers', title: 'Admin: Subscribers' },
  { path: '/admin/settings', title: 'Admin: Settings' },
];

/** @returns {{home?: boolean, title?: string, description?: string, noindex: boolean}} */
export const getRouteMeta = (pathname) => {
  const route = ROUTES.find(({ path }) => matchPath({ path, end: true }, pathname));
  const noindex = PRIVATE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

  return route ? { ...route, noindex } : { title: 'Page Not Found', noindex: true };
};