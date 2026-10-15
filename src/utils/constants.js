export const ROLES = { ADMIN: 'admin', CUSTOMER: 'customer' };

// Bump whenever seed data in data/mockData.js changes shape or content: stored
// copies with an older version are replaced by the new seed on next load.
// (v2: orders became a seeded collection with email ownership and status history.)
export const DATA_VERSION = 2;