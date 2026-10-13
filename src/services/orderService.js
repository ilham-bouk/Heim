import { getFinalPrice } from '../utils/product';

// Order data helpers: PURE functions. Persistence/state lives in
// context/OrderContext.jsx; demo seed orders live in data/orderSeed.js.
//
// Real-backend seams:
//   OrderContext.placeOrder        → POST /orders (the server builds the order: `buildOrder` disappears)
//   OrderContext `orders`          → GET /me/orders
//   OrderContext `allOrders`       → GET /admin/orders (admin only)
//   OrderContext.updateOrderStatus → PATCH /orders/:id/status (the server enforces the transitions)
//   OrderContext.getOrderById      → GET /orders/:id. It is deliberately NOT scoped to the signed-in
//                                    user here (guests need their confirmation page): a real API must authorise it.

/**
 * Order shape:
 * {
 *   id: string,                  // e.g. 'HEIM-10231'
 *   date: string,                // ISO timestamp the order was placed
 *   status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled',
 *   statusHistory: [{ status, at }],   // ISO timestamps, oldest first
 *   email: string,               // contact email = the ownership key ("my orders" matches it, case-insensitively)
 *   items: [
 *     { productId: number, name: string, image: string, category: string, price: number, quantity: number }
 *   ],                           // price = unit price actually charged (discount applied)
 *   subtotal: number,
 *   shipping: number,
 *   tax: number,
 *   discount: number,
 *   promoCode?: string,
 *   total: number,
 *   shippingAddress: {
 *     fullName: string, line1: string, line2?: string, city: string, state: string, zip: string, country: string
 *   },
 *   payment?: { brand: string, last4: string }
 * }
 */

// ── Status machine ──────────────────────────────────────────────────────────
// The ONE place that defines which statuses exist and how they connect.
// The admin buttons, the badges and the active-order banner all read it.
// To add a status: add an entry here (and an action label below).
//   tone     → StatusBadge tone
//   isActive → counts as "in flight" (Account banner, admin "in progress")
//   next     → statuses this one may move to ([] = terminal)
export const ORDER_STATUS_CONFIG = {
  Processing: { tone: 'neutral', isActive: true, next: ['Shipped', 'Cancelled'] },
  Shipped: { tone: 'accent', isActive: true, next: ['Delivered'] },
  Delivered: { tone: 'success', isActive: false, next: [] },
  Cancelled: { tone: 'danger', isActive: false, next: [] },
};

export const ORDER_STATUSES = Object.keys(ORDER_STATUS_CONFIG);

// Label of the admin button that moves an order INTO a status.
export const ORDER_ACTION_LABELS = {
  Shipped: 'Mark as shipped',
  Delivered: 'Mark as delivered',
  Cancelled: 'Cancel order',
};

export const getStatusTone = (status) => ORDER_STATUS_CONFIG[status]?.tone ?? 'neutral';
export const isActiveOrder = (order) => ORDER_STATUS_CONFIG[order.status]?.isActive ?? false;
export const getNextStatuses = (order) => ORDER_STATUS_CONFIG[order.status]?.next ?? [];
export const canTransition = (order, nextStatus) => getNextStatuses(order).includes(nextStatus);

/**
 * Returns the order moved to `nextStatus` with a history entry, or the order
 * unchanged if the transition isn't allowed (callers validate first and throw).
 */
export const applyStatusChange = (order, nextStatus, at = new Date()) =>
  canTransition(order, nextStatus)
    ? {
        ...order,
        status: nextStatus,
        statusHistory: [...(order.statusHistory ?? []), { status: nextStatus, at: at.toISOString() }],
      }
    : order;

// ── Ids ─────────────────────────────────────────────────────────────────────
export const ORDER_ID_PREFIX = 'HEIM-';
export const ORDER_ID_FLOOR = 10000;

export const formatOrderId = (number) => `${ORDER_ID_PREFIX}${number}`;

// Next sequential id across every known order, e.g. HEIM-10134.
// Orders are never deleted, so max + 1 never reuses an id. If you add order
// deletion, keep a persisted counter instead (see CatalogContext.reserveId).
const getNextOrderId = (existingOrders) => {
  const highest = existingOrders.reduce(
    (max, order) => Math.max(max, parseInt(order.id.replace(ORDER_ID_PREFIX, ''), 10) || 0),
    ORDER_ID_FLOOR
  );
  return formatOrderId(highest + 1);
};

// ── Builders ────────────────────────────────────────────────────────────────
const toShippingAddress = ({ fullName, line1, line2, city, state, zip, country }) => ({
  fullName, line1, line2, city, state, zip, country,
});

/** Snapshot of one cart line (or seed product + quantity). Price is what was actually charged. */
export const toOrderItem = (item) => ({
  productId: item.id,
  name: item.name,
  image: item.image,
  category: item.category,
  price: getFinalPrice(item),
  quantity: item.quantity,
});

/**
 * Builds an Order in the shape documented above from checkout data, so the
 * order doesn't change if the catalog changes later.
 */
export const buildOrder = (
  { cartItems, totals, shippingAddress, payment, email, promoCode },
  existingOrders = []
) => {
  const placedAt = new Date().toISOString();

  return {
    id: getNextOrderId(existingOrders),
    date: placedAt,
    status: 'Processing',
    statusHistory: [{ status: 'Processing', at: placedAt }],
    email,
    items: cartItems.map(toOrderItem),
    subtotal: totals.subtotal,
    shipping: totals.shipping,
    tax: totals.tax,
    discount: totals.discount,
    promoCode,
    total: totals.total,
    shippingAddress: toShippingAddress(shippingAddress),
    payment: { brand: payment.brand, last4: payment.last4 },
  };
};