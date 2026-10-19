// Demo seed subscribers. THROWAWAY: delete this file when you wire a real backend
// (SubscriberContext's `subscribers` then comes from GET /admin/subscribers).
//
// Dates are written as "days ago" so the demo never goes stale.

const SEED_SUBSCRIBERS = [
  { email: 'liam.carter@example.com', daysAgo: 1 },
  { email: 'olivia.bennett@example.com', daysAgo: 2 },
  { email: 'sofia.martinez@example.com', daysAgo: 4 },
  { email: 'daniel.ortiz@example.com', daysAgo: 6 },
  { email: 'hannah.lee@example.com', daysAgo: 9 },
  { email: 'noah.williams@example.com', daysAgo: 12 },
  { email: 'priya.shah@example.com', daysAgo: 16 },
  { email: 'ethan.kim@example.com', daysAgo: 21 },
  { email: 'chloe.dubois@example.com', daysAgo: 27 },
  { email: 'marcus.reed@example.com', daysAgo: 35 },
  { email: 'ava.nguyen@example.com', daysAgo: 44 },
  { email: 'lucas.garcia@example.com', daysAgo: 58 },
  { email: 'grace.turner@example.com', daysAgo: 73 },
  { email: 'omar.haddad@example.com', daysAgo: 91 },
  { email: 'isabella.rossi@example.com', daysAgo: 118 },
];

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

const buildSeedSubscribers = () => {
  const now = Date.now();
  return SEED_SUBSCRIBERS.map(({ email, daysAgo }, index) => ({
    email,
    // Spread the time of day a little so same-day entries don't share a timestamp.
    subscribedAt: new Date(now - daysAgo * DAY_MS - ((index * 5) % 18) * HOUR_MS).toISOString(),
  }));
};

// Memoised at module level: useSeededCollection calls its seed getter on every
// render, and a fresh `Date.now()` each time would change every date.
let cachedSeed = null;
export const getSeedSubscribers = () => {
  if (!cachedSeed) cachedSeed = buildSeedSubscribers();
  return cachedSeed;
};