import { getFinalPrice } from './product';
import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_COST, TAX_RATE } from './constants';

// Stage 6 replaces this default with values from the Settings store.
const DEFAULT_RULES = {
  taxRate: TAX_RATE,
  freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
  standardShippingCost: STANDARD_SHIPPING_COST,
};

/**
 * Cart/order totals. Pure: used by CartContext (live cart) and the order seeder.
 * Mock simplification: shipping and tax use the pre-discount subtotal.
 * Real backend: the server computes totals; this becomes display-only.
 *
 * @param {Array<{price: number, discount?: number, quantity: number}>} items
 * @param {number} [promoRate=0] - e.g. 0.1 for 10% off the subtotal
 * @param {{taxRate: number, freeShippingThreshold: number, standardShippingCost: number}} [rules]
 * @returns {{subtotal: number, shipping: number, tax: number, discount: number, total: number}}
 */
export const calculateTotals = (items, promoRate = 0, rules = DEFAULT_RULES) => {
  const subtotal = items.reduce((sum, item) => sum + getFinalPrice(item) * item.quantity, 0);

  const shipping =
    items.length === 0 || subtotal >= rules.freeShippingThreshold ? 0 : rules.standardShippingCost;
  const tax = Math.round(subtotal * rules.taxRate);
  const discount = promoRate ? Math.round(subtotal * promoRate) : 0;

  return { subtotal, shipping, tax, discount, total: subtotal + shipping + tax - discount };
};