import { formatLocalDate } from '../utils/format';

// Promo data helpers: PURE functions over arrays. State lives in
// context/PromoContext.jsx; demo seed promos live in data/promoSeed.js.
//
// Real-backend seams:
//   PromoContext `promos`      → GET /admin/promos (admin only)
//   PromoContext add/update/delete → POST/PATCH/DELETE /admin/promos/:code
//   CartContext.applyPromo     → POST /cart/promo. The server validates and returns the discount;
//                                `validatePromo` becomes display-only. A real API should return ONE
//                                generic error for every failure, so nobody can probe which codes exist.

/**
 * Promo shape:
 * {
 *   code: string,         // uppercase, unique, the key. Never changes after creation.
 *   type: 'percent' | 'fixed',
 *   value: number,        // percent: 1-100. fixed: whole currency units.
 *   active: boolean,
 *   expiresAt?: string    // 'YYYY-MM-DD', valid through the END of that day (local time)
 * }
 */

export const PROMO_TYPES = [
  { value: 'percent', label: 'Percentage off' },
  { value: 'fixed', label: 'Fixed amount off' },
];

export const PROMO_CODE_PATTERN = /^[A-Z0-9_-]{3,20}$/;

export const normalizeCode = (code = '') => code.trim().toUpperCase();

/** Local calendar day as 'YYYY-MM-DD' (not toISOString, which is UTC and can be a day off). */
export const toLocalDateString = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const findPromoByCode = (list, code) => list.find((promo) => promo.code === normalizeCode(code)) ?? null;

export const isCodeTaken = (list, code) => findPromoByCode(list, code) !== null;

export const isExpired = (promo, now = new Date()) =>
  !!promo.expiresAt && toLocalDateString(now) > promo.expiresAt;

/** 'Active' | 'Inactive' | 'Expired'. Switched off by the admin wins over expired. */
export const getPromoStatus = (promo, now = new Date()) => {
  if (!promo.active) return 'Inactive';
  return isExpired(promo, now) ? 'Expired' : 'Active';
};

export const selectActivePromos = (list, now = new Date()) =>
  list.filter((promo) => getPromoStatus(promo, now) === 'Active');

/** e.g. "10% off" or "$20 off". */
export const describePromo = (promo) =>
  promo.type === 'percent' ? `${promo.value}% off` : `$${promo.value} off`;

/**
 * Can this code be applied right now?
 * @returns {{ok: true, promo: object} | {ok: false, error: string}}
 */
export const validatePromo = (list, code, now = new Date()) => {
  const promo = findPromoByCode(list, code);
  if (!promo) return { ok: false, error: "That promo code isn't valid." };
  if (!promo.active) return { ok: false, error: "This code isn't active right now." };
  if (isExpired(promo, now)) return { ok: false, error: `This code expired on ${formatLocalDate(promo.expiresAt)}.` };
  return { ok: true, promo };
};

// An empty expiry is removed (not stored as ''), like optional product fields.
const withExpiry = (promo, expiresAt) => {
  const next = { ...promo };
  if (expiresAt) next.expiresAt = expiresAt;
  else delete next.expiresAt;
  return next;
};

/** Real backend: the server builds the promo and returns it. */
export const createPromo = (input) =>
  withExpiry(
    { code: normalizeCode(input.code), type: input.type, value: input.value, active: input.active },
    input.expiresAt
  );

/** Applies admin input to an existing promo; the code is kept. */
export const applyPromoInput = (promo, input) =>
  withExpiry({ ...promo, type: input.type, value: input.value, active: input.active }, input.expiresAt);