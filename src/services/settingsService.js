import { defaultSettings } from '../config/site';

// Settings helpers: PURE functions. State lives in context/SettingsContext.jsx;
// the defaults live in config/site.js (the file a buyer edits to re-brand).
//
// Real-backend seams:
//   SettingsContext `settings`        → GET /settings (public: the storefront needs it)
//   SettingsContext.updateSettings    → PUT /admin/settings (admin only)

/**
 * Settings shape (see config/site.js for the defaults):
 * {
 *   store:   { name, tagline },
 *   contact: { address: string[], phone, phoneAlt, email, supportEmail, hours: string[] },
 *   social:  { facebook, twitter, instagram },   // full https:// URLs, '' = hidden
 *   pricing: { taxRate (fraction, 0.1 = 10%), freeShippingThreshold, standardShippingCost }
 * }
 */

// Social networks the Footer and the Settings form know about (key = settings.social key).
export const SOCIAL_NETWORKS = [
  { key: 'facebook', label: 'Facebook' },
  { key: 'twitter', label: 'X (Twitter)' },
  { key: 'instagram', label: 'Instagram' },
];

/**
 * Stored values laid over the defaults, section by section. A setting added to
 * config/site.js later shows up for existing users without a DATA_VERSION bump.
 */
export const mergeSettings = (stored) => ({
  store: { ...defaultSettings.store, ...stored?.store },
  contact: { ...defaultSettings.contact, ...stored?.contact },
  social: { ...defaultSettings.social, ...stored?.social },
  pricing: { ...defaultSettings.pricing, ...stored?.pricing },
});

/** 0.1 -> 10, 0.075 -> 7.5 (rounded to avoid float noise like 10.000000000000002). */
export const toPercent = (rate) => Number((rate * 100).toFixed(2));

/** 7.5 -> 0.075 */
export const fromPercent = (percent) => Number((percent / 100).toFixed(4));