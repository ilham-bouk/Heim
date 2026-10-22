import { isActiveOrder } from './orderService';

// Dashboard aggregation: PURE functions over arrays. `now` is a parameter so
// they can be tested with a fixed date. There is no dashboard store: everything
// is derived from orders (and, in the page, customers/messages/subscribers).
//
// Definitions (list them in the README):
//   - Revenue = order.total of every order that is NOT Cancelled (same as Customers' "Total spent").
//   - Orders  = every order placed in the window, including cancelled ones.
//
// Real-backend seam:
//   getOrderKpis (and the chart helpers added later) → GET /admin/dashboard
//   (the server aggregates; this file goes away).

export const KPI_WINDOW_DAYS = 30;

const DAY_MS = 24 * 60 * 60 * 1000;

const summarize = (orders) => ({
  count: orders.length,
  revenue: orders.reduce((sum, order) => (order.status === 'Cancelled' ? sum : sum + order.total), 0),
});

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