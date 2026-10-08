// Values like TAX_RATE are mock
// business rules for now; when you wire a real backend these will likely
// come from your API/settings instead.

// Mock store rules — replace with API-driven values later.
export const TAX_RATE = 0.1; // 10%
export const FREE_SHIPPING_THRESHOLD = 100;
export const STANDARD_SHIPPING_COST = 10;
export const PROMO_CODES = { HEIM10: 0.1 };
export const ROLES = { ADMIN: 'admin', CUSTOMER: 'customer' };

// Bump whenever seed data in data/mockData.js changes shape or content: stored
// copies with an older version are replaced by the new seed on next load.
export const DATA_VERSION = 1;