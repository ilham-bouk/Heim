import { ORDER_STATUSES, getStatusTone, isActiveOrder } from './orderService';

// Dashboard aggregation: PURE functions over arrays. `now` is a parameter so
// they can be tested with a fixed date. There is no dashboard store: everything
// is derived from orders (and, in the page, customers/messages/subscribers).
//
// Definitions (list them in the README):
//   - Revenue = order.total of every order that is NOT Cancelled (same as Customers' "Total spent").
//   - Orders (KPI) = orders placed in the window, NOT counting Cancelled ones.
//   - Orders by status counts EVERY order, so cancelled ones stay visible there.
//   - Category sales and top products use the item snapshot (price x quantity) of
//     non-Cancelled orders. Tax and shipping can't be attributed to a category, so
//     category sales add up to less than revenue.
//
// Real-backend seam:
//   every export below → GET /admin/dashboard (the server aggregates; this file goes away).

export const KPI_WINDOW_DAYS = 30;
export const REVENUE_MONTHS = 6;
export const TOP_PRODUCTS_LIMIT = 5;
export const RECENT_LIMIT = 5;

const DAY_MS = 24 * 60 * 60 * 1000;

const isBillable = (order) => order.status !== 'Cancelled';

const summarize = (orders) => {
  const billable = orders.filter(isBillable);
  return {
    count: billable.length,
    revenue: billable.reduce((sum, order) => sum + order.total, 0),
  };
};

/**
 * Change versus the previous period.
 * @returns {null | {kind: 'new'} | {kind: 'change', percent: number, direction: 'up'|'down'|'flat'}}
 *   null = nothing to compare (both periods are 0); 'new' = previous was 0.
 */
export const getDelta = (current, previous) => {
  if (previous === 0) return current > 0 ? { kind: 'new' } : null;
  const percent = Math.round(((current - previous) / previous) * 100);
  return { kind: 'change', percent, direction: percent > 0 ? 'up' : percent < 0 ? 'down' : 'flat' };
};

/**
 * KPI numbers for the orders-based cards.
 * @param {Array} orders - every order (see services/orderService.js)
 * @param {Date} [now]
 * @returns {{
 *   revenue: {value: number, delta: object|null},
 *   orders: {value: number, delta: object|null},
 *   inProgress: number
 * }}
 */
export const getOrderKpis = (orders, now = new Date()) => {
  const end = now.getTime();
  const windowMs = KPI_WINDOW_DAYS * DAY_MS;
  const current = [];
  const previous = [];

  orders.forEach((order) => {
    const placedAt = Date.parse(order.date);
    if (placedAt > end - windowMs && placedAt <= end) current.push(order);
    else if (placedAt > end - 2 * windowMs && placedAt <= end - windowMs) previous.push(order);
  });

  const now30 = summarize(current);
  const prev30 = summarize(previous);

  return {
    revenue: { value: now30.revenue, delta: getDelta(now30.revenue, prev30.revenue) },
    orders: { value: now30.count, delta: getDelta(now30.count, prev30.count) },
    inProgress: orders.filter(isActiveOrder).length,
  };
};

const monthKey = (date) => `${date.getFullYear()}-${date.getMonth()}`;

/**
 * Revenue per local calendar month, oldest first, ending with the current month.
 * @returns {Array<{key: string, label: string, fullLabel: string, value: number, current: boolean}>}
 */
export const getMonthlyRevenue = (orders, now = new Date(), months = REVENUE_MONTHS) => {
  const buckets = Array.from({ length: months }, (_, index) => {
    const offset = months - 1 - index;
    const start = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    return {
      key: monthKey(start),
      label: start.toLocaleDateString(undefined, { month: 'short' }),
      fullLabel: start.toLocaleDateString(undefined, { month: 'long', year: 'numeric' }),
      value: 0,
      current: offset === 0,
    };
  });
  const byKey = new Map(buckets.map((bucket) => [bucket.key, bucket]));

  orders.forEach((order) => {
    if (!isBillable(order)) return;
    const bucket = byKey.get(monthKey(new Date(order.date)));
    if (bucket) bucket.value += order.total;
  });

  return buckets;
};

/** Every status (zeros included) with how many orders are in it. Counts ALL orders. */
export const getStatusBreakdown = (orders) =>
  ORDER_STATUSES.map((status) => ({
    status,
    tone: getStatusTone(status),
    count: orders.filter((order) => order.status === status).length,
  }));

/** Item value per category (price x quantity), biggest first. Excludes Cancelled orders. */
export const getCategorySales = (orders) => {
  const totals = new Map();

  orders.filter(isBillable).forEach((order) => {
    order.items.forEach((item) => {
      const category = item.category || 'Uncategorized';
      totals.set(category, (totals.get(category) ?? 0) + item.price * item.quantity);
    });
  });

  return [...totals]
    .map(([category, value]) => ({ category, value }))
    .sort((a, b) => b.value - a.value);
};

/** Best sellers by units, then by revenue. Excludes Cancelled orders; names come from the snapshot. */
export const getTopProducts = (orders, limit = TOP_PRODUCTS_LIMIT) => {
  const byProduct = new Map();

  // Orders are newest first, so the first name seen is the most recent snapshot.
  orders.filter(isBillable).forEach((order) => {
    order.items.forEach((item) => {
      const entry = byProduct.get(item.productId) ?? {
        productId: item.productId,
        name: item.name,
        units: 0,
        revenue: 0,
      };
      entry.units += item.quantity;
      entry.revenue += item.price * item.quantity;
      byProduct.set(item.productId, entry);
    });
  });

  return [...byProduct.values()]
    .sort((a, b) => b.units - a.units || b.revenue - a.revenue)
    .slice(0, limit);
};

/** Newest orders first (any status, cancelled included: it is an activity feed). */
export const getRecentOrders = (orders, limit = RECENT_LIMIT) =>
  [...orders].sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit);

/** Newest messages first, read or unread. */
export const getRecentMessages = (messages, limit = RECENT_LIMIT) =>
  [...messages].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, limit);