// Demo seed messages. THROWAWAY: delete this file when you wire a real backend
// (MessageContext's `messages` then comes from GET /admin/messages).
//
// Ages are written as "hours ago" so the demo never goes stale.
// Listed oldest first: ids ascend with age. Three are unread, two are read.

const SEED_MESSAGES = [
  {
    name: 'Omar Haddad',
    email: 'omar.haddad@example.com',
    phone: '+1 (555) 010-0131',
    subject: 'partnership',
    message:
      "I run a small interior design studio and I'd like to talk about trade pricing for our clients.\n\nWho is the right person to speak to?",
    hoursAgo: 11 * 24,
    read: true,
  },
  {
    name: 'Grace Turner',
    email: 'grace.turner@example.com',
    subject: 'general-question',
    message: "Do you ship to Canada? I couldn't find the list of shipping countries on the site.",
    hoursAgo: 6 * 24,
    read: true,
  },
  {
    name: 'Chloe Dubois',
    email: 'chloe.dubois@example.com',
    phone: '+1 (555) 010-0132',
    subject: 'custom-order',
    message:
      "We're renovating a café and need six bar stools with a custom seat height of 75 cm. Do you take bulk custom orders, and what is the usual lead time?",
    hoursAgo: 2 * 24,
    read: false,
  },
  {
    name: 'Marcus Reed',
    email: 'marcus.reed@example.com',
    subject: 'delivery-issue',
    message:
      'My dining table arrived with a scratch on one leg. I have photos.\n\nCould you tell me how to arrange a replacement part?',
    hoursAgo: 20,
    read: false,
  },
  {
    name: 'Olivia Bennett',
    email: 'olivia.bennett@example.com',
    phone: '+1 (555) 010-0133',
    subject: 'product-inquiry',
    message:
      "Is the Scandinavian Sofa available in a darker fabric? I'm furnishing a small apartment and would love to see swatches before I order.",
    hoursAgo: 3,
    read: false,
  },
];

const HOUR_MS = 60 * 60 * 1000;

const buildSeedMessages = () => {
  const now = Date.now();
  return SEED_MESSAGES.map(({ hoursAgo, ...message }, index) => ({
    id: index + 1,
    ...message,
    createdAt: new Date(now - hoursAgo * HOUR_MS).toISOString(),
  }));
};

// Memoised at module level: useSeededCollection calls its seed getter on every
// render, and a fresh `Date.now()` each time would change every date.
let cachedSeed = null;
export const getSeedMessages = () => {
  if (!cachedSeed) cachedSeed = buildSeedMessages();
  return cachedSeed;
};