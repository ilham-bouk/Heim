// Default store settings: the ONE file to edit when re-branding this template.
// The admin (Admin → Settings) can override these at runtime; the overrides are
// stored in localStorage under `heim_settings` and merged over this object
// (see context/SettingsContext.jsx). Shape documented in services/settingsService.js.
//
// Not editable at runtime, so change them in code: the currency symbol ("$" is
// written directly in the UI) and brand names inside page copy (About, sign-in
// quotes, index.html title).

export const defaultSettings = {
  store: {
    name: 'Heim',
    tagline:
      'Beautifully crafted modern furniture for your home. We believe in quality, sustainability, and timeless design.',
  },
  contact: {
    address: ['123 Design Street', 'New York, NY 10001'],
    phone: '+1 (555) 123-4567',
    phoneAlt: '+1 (555) 123-4568',
    email: 'info@heimfurniture.com',
    supportEmail: 'support@heimfurniture.com',
    hours: ['Monday - Friday: 9am - 6pm', 'Saturday & Sunday: 10am - 4pm'],
  },
  // Full URLs. Empty string = the footer link is hidden.
  social: {
    facebook: 'https://facebook.com',
    twitter: 'https://twitter.com',
    instagram: 'https://instagram.com',
  },
  // Mock business rules. A real backend computes these server-side.
  pricing: {
    taxRate: 0.1, // 10%
    freeShippingThreshold: 100,
    standardShippingCost: 10,
  },
};