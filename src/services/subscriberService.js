import { normalizeEmail } from '../utils/user';

// Subscriber data helpers: PURE functions over arrays. State lives in
// context/SubscriberContext.jsx; demo seed subscribers live in data/subscriberSeed.js.
//
// Real-backend seams:
//   SubscriberContext `subscribers`  → GET /admin/subscribers (admin only)
//   SubscriberContext.subscribe      → POST /newsletter/subscribers (public). A real API should answer
//                                      the same way for new and existing emails, so nobody can probe the list.
//   SubscriberContext.unsubscribe    → DELETE /admin/subscribers/:email

/**
 * Subscriber shape:
 * {
 *   email: string,        // normalized (trimmed, lowercase), unique, the key
 *   subscribedAt: string  // ISO timestamp
 * }
 */

export const createSubscriber = (email, at = new Date()) => ({
  email: normalizeEmail(email),
  subscribedAt: at.toISOString(),
});

export const isSubscribed = (list, email) => {
  const wanted = normalizeEmail(email);
  return list.some((subscriber) => subscriber.email === wanted);
};

/** Returns the list with the email added, or the SAME list if it is already there. */
export const addSubscriber = (list, email, at) =>
  isSubscribed(list, email) ? list : [...list, createSubscriber(email, at)];

export const removeSubscriber = (list, email) => {
  const target = normalizeEmail(email);
  return list.filter((subscriber) => subscriber.email !== target);
};