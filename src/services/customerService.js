import { customers } from '../data/mockData';
import { normalizeEmail } from '../utils/user';

// Customer data helpers: PURE functions over arrays. There is no customers
// store: the directory is DERIVED from the seed pool plus the emails found
// in orders, so nothing here can drift out of sync with Auth or Reset.
//
// Limits (list them in the README):
//   - A sign-up that never orders is not listed (sign-ups aren't persisted).
//   - Customers who only exist in orders take their name and location from
//     their latest order's shipping address, which can be a gift recipient.
//
// Real-backend seam:
//   deriveCustomers → GET /admin/customers (the server aggregates; this file goes away).

/**
 * Customer row shape (derived, never stored):
 * {
 *   id: string,              // normalized email
 *   email: string,
 *   fullName: string,
 *   location: string,        // "City, ST" or ''
 *   orderCount: number,      // orders that are NOT cancelled
 *   totalSpent: number,      // excludes cancelled orders
 *   lastOrderAt: string|null // ISO timestamp of the newest order
 * }
 */

export const getSeedCustomers = () => customers;

const toLocation = ({ city, state } = {}) => [city, state].filter(Boolean).join(', ');

/**
 * @param {Array} orders - every order (see services/orderService.js)
 * @param {Array} [seedCustomers] - the seed pool (data/mockData.js)
 * @param {string} [excludedEmail] - e.g. the admin's email; never listed as a customer
 * @returns {Array} customer rows, unsorted
 */
export const deriveCustomers = (orders, seedCustomers = getSeedCustomers(), excludedEmail = '') => {
  const excluded = normalizeEmail(excludedEmail);
  const byEmail = new Map();
  const seeded = new Set();

  seedCustomers.forEach((customer) => {
    const id = normalizeEmail(customer.email);
    if (!id || id === excluded) return;
    seeded.add(id);
    byEmail.set(id, {
      id,
      email: customer.email,
      fullName: customer.fullName,
      location: toLocation(customer.address),
      orderCount: 0,
      totalSpent: 0,
      lastOrderAt: null,
    });
  });

  orders.forEach((order) => {
    const id = normalizeEmail(order.email ?? '');
    if (!id || id === excluded) return;

    let customer = byEmail.get(id);
    if (!customer) {
      customer = {
        id,
        email: order.email.trim(),
        fullName: '',
        location: '',
        orderCount: 0,
        totalSpent: 0,
        lastOrderAt: null,
      };
      byEmail.set(id, customer);
    }

    if (order.status !== 'Cancelled') {
      customer.orderCount += 1;
      customer.totalSpent += order.total;
    }
    
    // ISO timestamps compare correctly as strings.
    if (!customer.lastOrderAt || order.date > customer.lastOrderAt) {
      customer.lastOrderAt = order.date;
      if (!seeded.has(id)) {
        customer.fullName = order.shippingAddress?.fullName ?? '';
        customer.location = toLocation(order.shippingAddress);
      }
    }
  });

  return [...byEmail.values()].map((customer) => ({
    ...customer,
    fullName: customer.fullName || customer.email,
  }));
};