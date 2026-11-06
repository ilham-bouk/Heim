# Changelog

## [1.0.0] - 2026-11-06

First official release of Heim, a complete furniture e-commerce front-end template (React 19, Vite, Tailwind CSS v4, React Router v7).

- **Storefront:** home, shop with filters and search (shareable URLs), product pages, wishlist, cart with promo codes, blog, contact form, newsletter signup.
- **Checkout:** multi-step flow (shipping, payment, review) for members and guests, with order confirmation and guest order tracking.
- **Customer account:** profile, orders, addresses, saved cards (brand and last 4 only), settings.
- **Admin area:** dashboard with KPIs and charts, orders and status flow, customers, promo codes, products, categories, blog, messages, subscribers, store settings.
- **Info pages:** FAQ, Shipping, Returns, Track Order, Privacy, Terms.
- **Quality:** accessible (keyboard, focus management, ARIA), responsive, per-page SEO meta, 404 and not-authorised pages.
- **Developer-friendly:** mock data in `localStorage`, pure service layer with documented real-backend seams, one-file re-branding (`config/site.js`), design tokens, "Reset demo data".
- **Deployment:** ready for Netlify (SPA redirects included).

### Known limits

- No backend: data is per-browser and roles are UI gating only. Real authorisation must be enforced server-side.
- Sample data, demo credentials and placeholder images (AI-generated) must be replaced before going live.
- Privacy and Terms are placeholder text, not legal advice.
- Image upload is disabled; prices are in `$` with no cents and no currency setting.
- See the README for the full list.