// Order data service — see productService.js for the reasoning behind this
// pattern. Currently backed by mock data since there's no Checkout flow yet
// to generate real orders.
//
// To wire this up for real: once Checkout exists, have it write completed
// orders into a `heim_orders` localStorage key (via useLocalStorage, same
// as Cart/Wishlist/Address), using the Order shape documented below. This
// file's functions can then read from that key instead of mockOrders, and
// every component that calls getOrders()/getOrderById() keeps working
// unchanged.
//
// To wire a real backend later: replace each function body with a
// fetch/axios call scoped to the signed-in user (e.g. GET /me/orders).

import { mockOrders } from '../data/mockData';

/**
 * Order shape:
 * {
 *   id: string,                // e.g. 'HEIM-10231'
 *   date: string,               // ISO date string
 *   status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled',
 *   items: [
 *     { productId: number, name: string, image: string, price: number, quantity: number }
 *   ],
 *   subtotal: number,
 *   shipping: number,
 *   tax: number,
 *   total: number,
 *   shippingAddress: {
 *     fullName: string, line1: string, city: string, state: string, zip: string, country: string
 *   }
 * }
 *
 * Note: `items[].price` is the price actually paid at checkout, not a live
 * reference to the product's current price/discount — an order shouldn't
 * change retroactively if the catalog changes later.
 */

export const getOrders = () => mockOrders;

export const getOrderById = (id) =>
  mockOrders.find((order) => order.id === id) || null;

export const getActiveOrders = () =>
  mockOrders.filter((order) => ['Processing', 'Shipped'].includes(order.status));