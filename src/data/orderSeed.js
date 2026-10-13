// Demo seed orders. THROWAWAY: delete this file when you wire a real backend
// (OrderContext's `orders` then comes from GET /me/orders).
//
// To add or remove demo orders, edit the SEED_ORDERS list below. Each row:
//   customerId → id from `customers` in data/mockData.js
//   daysAgo    → how long ago it was placed (dates are relative to "now", so the
//                dashboard always looks alive instead of going stale)
//   status     → keep it plausible for the age (recent = Processing/Shipped)
//   lines      → [[productId, quantity], ...] with ids from `products` in mockData.js
//   promoCode  → optional, a key of PROMO_CODES
//
// Totals come from the same calculateTotals the cart uses. Orders are stored
// once (see OrderContext + useSeededCollection), so admin edits survive until
// DATA_VERSION changes or "Reset demo data" runs.

import { products, customers } from './mockData';
import { calculateTotals } from '../utils/pricing';
import { PROMO_CODES } from '../utils/constants';
import { formatOrderId, toOrderItem } from '../services/orderService';

const SEED_ORDERS = [
  // Jane Doe (customerId 1, the demo customer): one in flight, one delivered, one cancelled.
  { customerId: 1, daysAgo: 4, status: 'Shipped', lines: [[3, 1]] },
  { customerId: 1, daysAgo: 38, status: 'Delivered', lines: [[1, 1], [4, 2]] },
  { customerId: 1, daysAgo: 96, status: 'Cancelled', lines: [[2, 1]] },

  // Everyone else
  { customerId: 2, daysAgo: 0, status: 'Processing', lines: [[19, 1]] },
  { customerId: 3, daysAgo: 1, status: 'Processing', lines: [[27, 2], [28, 1]] },
  { customerId: 4, daysAgo: 1, status: 'Processing', lines: [[7, 1]] },
  { customerId: 5, daysAgo: 2, status: 'Shipped', lines: [[12, 1]] },
  { customerId: 6, daysAgo: 2, status: 'Processing', lines: [[16, 2]], promoCode: 'HEIM10' },
  { customerId: 7, daysAgo: 3, status: 'Shipped', lines: [[20, 1], [19, 1]] },
  { customerId: 2, daysAgo: 5, status: 'Shipped', lines: [[9, 1]] },
  { customerId: 3, daysAgo: 6, status: 'Shipped', lines: [[15, 2], [13, 1]] },
  { customerId: 4, daysAgo: 7, status: 'Processing', lines: [[24, 1]] },
  { customerId: 5, daysAgo: 8, status: 'Shipped', lines: [[10, 2]] },
  { customerId: 6, daysAgo: 9, status: 'Cancelled', lines: [[17, 1]] },
  { customerId: 7, daysAgo: 11, status: 'Delivered', lines: [[5, 1]] },
  { customerId: 2, daysAgo: 14, status: 'Delivered', lines: [[22, 1]] },
  { customerId: 3, daysAgo: 17, status: 'Delivered', lines: [[26, 1], [27, 1]], promoCode: 'HEIM10' },
  { customerId: 4, daysAgo: 21, status: 'Delivered', lines: [[8, 1]] },
  { customerId: 5, daysAgo: 25, status: 'Delivered', lines: [[18, 1]] },
  { customerId: 6, daysAgo: 29, status: 'Delivered', lines: [[23, 2]] },
  { customerId: 7, daysAgo: 34, status: 'Delivered', lines: [[14, 1], [13, 2]] },
  { customerId: 2, daysAgo: 41, status: 'Delivered', lines: [[6, 2]] },
  { customerId: 3, daysAgo: 47, status: 'Cancelled', lines: [[25, 1]] },
  { customerId: 4, daysAgo: 55, status: 'Delivered', lines: [[21, 1], [20, 1]] },
  { customerId: 5, daysAgo: 63, status: 'Delivered', lines: [[2, 1]], promoCode: 'HEIM10' },
  { customerId: 6, daysAgo: 72, status: 'Delivered', lines: [[11, 1], [10, 1]] },
  { customerId: 7, daysAgo: 81, status: 'Delivered', lines: [[1, 1]] },
  { customerId: 2, daysAgo: 90, status: 'Delivered', lines: [[15, 1], [5, 1]] },
  { customerId: 3, daysAgo: 102, status: 'Delivered', lines: [[9, 1]], promoCode: 'HEIM10' },
  { customerId: 4, daysAgo: 114, status: 'Delivered', lines: [[19, 2]] },
  { customerId: 5, daysAgo: 126, status: 'Delivered', lines: [[3, 1], [16, 2]] },
  { customerId: 6, daysAgo: 138, status: 'Delivered', lines: [[17, 1]] },
  { customerId: 7, daysAgo: 147, status: 'Delivered', lines: [[24, 2]], promoCode: 'HEIM10' },
];

const FIRST_SEED_ORDER_NUMBER = 10101;
const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;
const STEP_HOURS = 30; // time between status changes in each order's history
const CARD_BRANDS = ['Visa', 'Mastercard', 'Amex', 'Discover'];

// Each path must be a valid walk through ORDER_STATUS_CONFIG (services/orderService.js).
const STATUS_PATHS = {
  Processing: ['Processing'],
  Shipped: ['Processing', 'Shipped'],
  Delivered: ['Processing', 'Shipped', 'Delivered'],
  Cancelled: ['Processing', 'Cancelled'],
};

const buildHistory = (status, placedAt, now) =>
  STATUS_PATHS[status].map((step, index) => ({
    status: step,
    at: new Date(Math.min(now, placedAt + index * STEP_HOURS * HOUR_MS)).toISOString(),
  }));

// One card per customer, derived from their id so the seed stays deterministic.
const toPayment = ({ id }) => ({
  brand: CARD_BRANDS[id % CARD_BRANDS.length],
  last4: String(1000 + ((id * 7919) % 9000)),
});

// Row -> order in the shape documented in services/orderService.js (id added by the caller).
const createOrder = ({ customerId, status, lines, promoCode }, placedAt, now) => {
  const customer = customers.find((c) => c.id === customerId);
  const items = lines.map(([productId, quantity]) => ({
    ...products.find((product) => product.id === productId),
    quantity,
  }));
  const totals = calculateTotals(items, promoCode ? PROMO_CODES[promoCode] : 0);

  return {
    date: new Date(placedAt).toISOString(),
    status,
    statusHistory: buildHistory(status, placedAt, now),
    items: items.map(toOrderItem),
    ...totals,
    shippingAddress: { fullName: customer.fullName, ...customer.address },
    payment: toPayment(customer),
    email: customer.email,
    ...(promoCode && { promoCode }),
  };
};

const buildSeedOrders = () => {
  const now = Date.now();

  return SEED_ORDERS
    // Spread the time of day a little so same-day orders don't share a timestamp.
    .map((row, index) => ({ row, placedAt: now - row.daysAgo * DAY_MS - ((index * 7) % 20) * HOUR_MS }))
    .sort((a, b) => a.placedAt - b.placedAt)
    // Ids ascend with date; the list is returned newest first (like a real "my orders" endpoint).
    .map(({ row, placedAt }, index) => ({
      id: formatOrderId(FIRST_SEED_ORDER_NUMBER + index),
      ...createOrder(row, placedAt, now),
    }))
    .reverse();
};

// Memoised at module level: useSeededCollection calls its seed getter on every
// render, and a fresh `Date.now()` each time would change every date.
let cachedSeed = null;
export const getSeedOrders = () => {
  if (!cachedSeed) cachedSeed = buildSeedOrders();
  return cachedSeed;
};