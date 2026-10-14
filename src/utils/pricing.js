import { getFinalPrice } from './product';
import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_COST, TAX_RATE } from './constants';

// Stage 6 replaces this default with values from the Settings store.
const DEFAULT_RULES = {
  taxRate: TAX_RATE,
  freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
  standardShippingCost: STANDARD_SHIPPING_COST,
};

/** Discount a promo gives on a subtotal, never more than the subtotal itself. */
export const getPromoDiscount = (subtotal, promo) => {
  if (!promo) return 0;
  const amount = promo.type === 'percent' ? Math.round(subtotal * (promo.value / 100)) : promo.value;
  return Math.min(amount, subtotal);
};

/**
 * Cart/order totals. Pure: used by CartContext (live cart) and the order seeder.
 * Mock simplification: shipping and tax use the pre-discount subtotal.
 * Real backend: the server computes totals; this becomes display-only.
 *
 * @param {Array<{price: number, discount?: number, quantity: number}>} items
 * @param {{type: 'percent'|'fixed', value: number}|null} [promo=null] - see services/promoService.js
 * @param {{taxRate: number, freeShippingThreshold: number, standardShippingCost: number}} [rules]
 * @returns {{subtotal: number, shipping: number, tax: number, discount: number, total: number}}
 */
export const calculateTotals = (items, promo = null, rules = DEFAULT_RULES) => {
  const subtotal = items.reduce((sum, item) => sum + getFinalPrice(item) * item.quantity, 0);

  const shipping =
    items.length === 0 || subtotal >= rules.freeShippingThreshold ? 0 : rules.standardShippingCost;
  const tax = Math.round(subtotal * rules.taxRate);
  const discount = getPromoDiscount(subtotal, promo);

  return { subtotal, shipping, tax, discount, total: subtotal + shipping + tax - discount };
};