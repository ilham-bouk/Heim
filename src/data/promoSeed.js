// Demo seed promos. THROWAWAY: delete this file when you wire a real backend
// (PromoContext's `promos` then comes from GET /admin/promos).
//
// Expiry is written as "days from today" so the demo never goes stale:
// a positive number is in the future, a negative number is already expired.

import { toLocalDateString } from '../services/promoService';

const SEED_PROMOS = [
  { code: 'HEIM10', type: 'percent', value: 10, active: true },
  { code: 'WELCOME20', type: 'fixed', value: 20, active: true, expiresInDays: 60 },
  { code: 'SPRING15', type: 'percent', value: 15, active: true, expiresInDays: -30 }, // expired on purpose
];

const inDays = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return toLocalDateString(date);
};

const buildSeedPromos = () =>
  SEED_PROMOS.map(({ expiresInDays, ...promo }) =>
    expiresInDays === undefined ? promo : { ...promo, expiresAt: inDays(expiresInDays) }
  );

// Memoised at module level: useSeededCollection calls its seed getter on every
// render, and the orders seeder looks promos up here too.
let cachedSeed = null;
export const getSeedPromos = () => {
  if (!cachedSeed) cachedSeed = buildSeedPromos();
  return cachedSeed;
};