# Heim: Furniture E-commerce Template

A complete, multi-page furniture store **front end** built with React 19, Vite, Tailwind CSS v4 and React Router v7. It ships a full storefront (shop, cart, multi-step checkout, customer account, blog) **and a working admin area** (dashboard, orders, customers, promo codes, catalog, blog, messages, subscribers, settings).

There is **no backend**. All data is mock, lives in `localStorage` and is structured so a real API can be swapped in without rewriting the UI. See [Real-backend seams](#real-backend-seams).

![Heim Mockup](src/assets/Mockup.png)

**Live demo:** https://ilham-bouk.github.io/Heim/

## Table of contents

- [Quick start](#quick-start)
- [Demo access](#demo-access)
- [Features](#features)
- [Pages and routes](#pages-and-routes)
- [Replace before going live](#replace-before-going-live)
- [Architecture](#architecture)
- [Real-backend seams](#real-backend-seams)
- [Admin dashboard definitions](#admin-dashboard-definitions)
- [Project structure](#project-structure)
- [Design system](#design-system)
- [Extending the template](#extending-the-template)
- [Accessibility](#accessibility)
- [Deployment](#deployment)
- [Known limits](#known-limits)
- [Credits](#credits)
- [Contact](#contact)

## Quick start

Requires [Node.js](https://nodejs.org/) **20.19 or newer** (Vite 7) and npm.

```sh
git clone https://github.com/ilham-bouk/Heim.git
cd Heim
npm install
npm run dev
```

Open the URL Vite prints. Because the app is served under `/Heim`, it is usually `http://localhost:5173/Heim/`.

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |
| `npm run deploy` | Build and publish `dist/` to GitHub Pages (`gh-pages`) |

## Demo access

The credentials below are public on purpose (they are also shown on the Sign In / Sign Up pages) so testers can open every area.

| Role | Email | Password | Lands on |
|---|---|---|---|
| Admin | `admin@heim.com` | `Admin1234` | `/admin` |
| Customer with order history | `jane.doe@example.com` | any 8+ characters | `/account` |
| Any other customer | any valid email | any 8+ characters | `/account` |

Guests can also check out without an account. Sign-in is a mock: roles are **UI gating only** (see [Known limits](#known-limits)).

Promo codes seeded for the demo: `HEIM10` (10% off), `WELCOME20` ($20 off, expires in 60 days) and `SPRING15` (expired on purpose, to show the expired state).

## Features

### Storefront
- Responsive multi-page UI for desktop and mobile
- Shop with category, price range and sort filters (category and sort live in the URL, so they are shareable)
- Product detail pages, related products, wishlist and cart
- Cart with promo codes, free-shipping progress and live totals
- Multi-step checkout (shipping, payment, review) for signed-in customers **and guests**, with a route guard that blocks skipping ahead and a confirmation page that survives refresh
- Customer account: profile, order history, saved addresses, saved cards (brand + last 4 only), settings
- Blog with search, categories, tags, related and previous/next posts
- Contact form (messages reach the admin), newsletter signup (subscribers reach the admin)
- Info pages: FAQ, Shipping, Returns, Track Order, Privacy, Terms, Forgot password
- 404 page and a "not authorised" page

### Admin
- **Dashboard:** KPI cards with period comparison, monthly revenue, orders by status, sales by category, top products, recent orders and messages. No chart library.
- **Orders:** list with search, status filter and sort, detail page, config-driven status flow (Processing → Shipped → Delivered, or Cancelled) with history
- **Customers:** read-only directory derived from orders
- **Promos:** percent or fixed codes, active flag, optional expiry
- **Products and Categories:** add, edit, delete (a category with products cannot be deleted; renaming cascades)
- **Blog posts:** drafts and published, featured flag, computed read time
- **Messages:** inbox with read/unread, reply by email, delete
- **Subscribers:** newsletter list with search and delete
- **Settings:** store name, contact details, social links, tax rate and shipping rules, plus **Reset demo data**

### Quality
- Semantic HTML, keyboard support, focus management and ARIA throughout (see [Accessibility](#accessibility))
- State kept in the URL where it matters (shop filters, order and message list filters, search, sort and page in the admin tables)
- Inline delete confirmations instead of modals
- Toast notifications with live regions

## Pages and routes

| Area | Routes |
|---|---|
| Storefront | `/`, `/shop`, `/shop/:id`, `/about`, `/blog`, `/blog/:id`, `/contact`, `/cart`, `/wishlist` |
| Auth | `/signin`, `/signup`, `/forgot-password` |
| Info | `/faq`, `/shipping`, `/returns`, `/track-order`, `/privacy`, `/terms` |
| Checkout | `/checkout/account`, `/checkout/shipping`, `/checkout/payment`, `/checkout/review`, `/checkout/confirmation/:orderId` |
| Account (signed in) | `/account/profile`, `/orders`, `/addresses`, `/wallet`, `/settings` |
| Admin (admin role) | `/admin`, `/admin/orders`, `/admin/orders/:id`, `/admin/customers`, `/admin/promos`, `/admin/products`, `/admin/products/new`, `/admin/products/:id/edit`, `/admin/categories`, `/admin/blog`, `/admin/blog/new`, `/admin/blog/:id/edit`, `/admin/messages`, `/admin/messages/:id`, `/admin/subscribers`, `/admin/settings` |

## Replace before going live

### Demo-only files

These exist to make the demo feel alive. Delete or replace them when you connect a real backend.

| File | What it is | When you go live |
|---|---|---|
| `src/data/mockData.js` | Seed products, categories, blog posts, customer pool | Replace with API data |
| `src/data/orderSeed.js` | 33 sample orders (relative dates) | Delete |
| `src/data/promoSeed.js` | 3 sample promo codes | Delete |
| `src/data/messageSeed.js` | 5 sample messages | Delete |
| `src/data/subscriberSeed.js` | 15 sample subscribers | Delete |
| `src/config/demo.js` | Public demo admin and customer credentials | Remove after editing its importers: `AuthContext`, `DemoHint`, `mockData.js`, `Admin-dashboard.jsx`, `Admin-customers.jsx`; the server returns the role |
| `src/components/auth/DemoHint.jsx` | Credentials shown under the auth forms | Delete |
| Reset card in `pages/Admin-settings.jsx`, `useResetDemoData` in `context/AppProviders.jsx` | "Reset demo data" | Delete; nothing local to reset |
| Demo notes in `AdminLayout`, `Checkout-account`, `Checkout-review`, `PaymentMethodForm`, `Forgot-password` | Visible "demo" disclaimers | Remove |
| `src/services/mediaService.js` | Mock image upload, **not wired** | Replace with a real upload |

### Text and branding to edit in code

The admin **Settings** page edits the store name, tagline, contact details, social links and pricing rules at runtime. The defaults live in `src/config/site.js`. Everything below is plain copy in the source.

- **The name "Heim"** appears in prose in: `pages/About.jsx` (story, headings, "Why choose Heim"), `pages/SignIn.jsx` (quotes), `pages/Checkout-account.jsx` ("New to Heim?"), `pages/Account-settings.jsx` ("Sign out of Heim"), `pages/Blog.jsx` (CTA), `index.html` (`<title>`), `package.json` (name, `homepage`), `vite.config.js` (`base`) and `App.jsx` (`basename`).
- **Marketing copy:** the Contact CTA ("10% off your first order"), the Promo banner ("up to 30% off"), the Hero ("New Collection 2026", "2,500+ Happy Customers"), the About stats and team, the features bar, the product page trust blocks ("2-Year Warranty", "30-Day Returns"), the auth side-panel trust lines, and the footer copyright year.
- **Policy copy:** `Faq.jsx`, `Shipping.jsx` and `Returns.jsx` (the shipping prices on those pages come from Settings). **`Privacy.jsx` and `Terms.jsx` are placeholder text, not legal advice.** Each page shows a notice saying so. Replace them with documents reviewed for your business and jurisdiction.
- **Currency:** the `$` symbol is written directly in about 25 places and prices have no cents. There is no currency setting.

### Images

All images were generated with Gemini and ship with the template (see [`IMAGE-CREDITS.md`](IMAGE-CREDITS.md)). Several products share one image, and all blog posts share one image, so replace them with real photography before selling. Products and categories created in the admin get `src/assets/product-placeholder.svg`. Image upload controls exist but are **disabled** on purpose; [Extending](#extending-the-template) lists the steps to enable them.

## Architecture

### Layers

- **`services/*.js`** are **pure functions** over arrays: seeds, selectors, builders, validators. No state, no React.
- **`context/*.jsx`** own persisted state and expose bound selectors. Every mutation is `async` with a mock latency (`MOCK_LATENCY_MS`), so swapping in `fetch` changes nothing for callers.
- **Forms** own their field state and validation. The **page** decides what "submit" means.
- **`hooks/useLocalStorage`** persists a value, syncs across tabs through the `storage` event, and fires `heim:storage-error` when a write fails (the toast provider shows an error).
- **`hooks/useSeededCollection(key, getSeed)`** persists a collection as `{ version, items }`, starting from a seed. When `DATA_VERSION` changes, the stored copy is replaced by a fresh seed.

### Provider order

`ToastProvider` and `BrowserRouter` sit **outside** `AppProviders`. Inside it, order matters: a provider can only read providers listed above it.

`Auth` → `Catalog` → `Blog` → `Settings` → `Promos` → `Subscribers` → `Messages` → `Cart` → `Wishlist` → `Address` → `PaymentMethod` → `Order` → `Checkout`

`Cart` resolves products from `Catalog`, promos from `Promos` and pricing rules from `Settings`, so those come first.

### Storage keys

Every key the app owns is registered in `src/utils/storageKeys.js`. **One key has exactly one owning context.**

| Key | Owner | Content |
|---|---|---|
| `heim_auth_user` | Auth | Mock session (kept when you reset demo data) |
| `heim_products`, `heim_categories`, `heim_id_counters` | Catalog | Catalog and never-reused id counters |
| `heim_blog_posts`, `heim_blog_id_counters` | Blog | Posts and id counters |
| `heim_settings` | Settings | Admin overrides, merged over `config/site.js` on every read |
| `heim_promos` | Promos | Promo codes |
| `heim_subscribers` | Subscribers | Newsletter list |
| `heim_messages`, `heim_message_id_counters` | Messages | Contact messages and id counter |
| `heim_cart_items`, `heim_cart_promo` | Cart | `{ id, quantity }` lines and `{ code }` |
| `heim_wishlist_items` | Wishlist | Product ids |
| `heim_addresses`, `heim_payment_methods` | Address, PaymentMethod | Saved addresses; cards as brand + last 4 |
| `heim_orders` | Order | All orders |
| `heim_checkout_draft` | Checkout | In-progress checkout (survives refresh) |

### Data rules worth knowing

- **Live resolution.** Cart and wishlist store only ids (and the promo as `{ code }`). Names, prices and discounts are resolved from the catalog on every render, so admin edits apply instantly and deleted products drop out.
- **Snapshots.** Orders copy the item name, image, category, charged price and promo code at purchase time, so history never changes when the catalog does.
- **Ids are never reused**, even after a delete, so old carts and orders cannot point at a different item. Orders use sequential `HEIM-10xxx` ids; promos are keyed by uppercase code.
- **Seed getters must be memoised at module level**, because `useSeededCollection` calls them on every render (see `orderSeed.js`).
- **`DATA_VERSION`** (`utils/constants.js`) is global. Bump it whenever seed data changes shape or content: it replaces **every** seeded collection on the next load.
- **Reset demo data** (Admin → Settings) clears every key except the signed-in user and remounts the provider tree. No page reload happens, so deep links keep working.

### Order status flow

One table defines it: `ORDER_STATUS_CONFIG` in `services/orderService.js`.

`Processing → Shipped | Cancelled`, `Shipped → Delivered`, `Delivered` and `Cancelled` are final. The admin buttons, badges, the account banner and the dashboard all read from it.

## Real-backend seams

The services and the data contexts carry "Real-backend seams" comments. Summary:

| In the template | Replace with |
|---|---|
| `AuthContext` sign in / sign up / sign out | Your auth provider; the session must return the user's role |
| `AuthContext.updateProfile`, `updatePassword` | `PATCH /me`, `POST /me/password` |
| `AuthContext.requestPasswordReset` | `POST /auth/forgot-password` (same answer for every email) |
| `CatalogContext` products and categories | `GET/POST/PATCH/DELETE /products`, `/categories` |
| `BlogContext` | `GET/POST/PATCH/DELETE /posts` |
| `SettingsContext` | `GET /settings` (public), `PUT /admin/settings` |
| `PromoContext` | `GET/POST/PATCH/DELETE /admin/promos` |
| `CartContext.applyPromo` | `POST /cart/promo` (server validates; one generic error for every failure) |
| `utils/pricing.js` totals | Computed on the server; the client only displays |
| `OrderContext.placeOrder` | `POST /orders` (the server builds the order) |
| `OrderContext.orders` | `GET /me/orders` |
| `OrderContext.allOrders` | `GET /admin/orders` |
| `OrderContext.updateOrderStatus` | `PATCH /orders/:id/status` (server enforces transitions) |
| `OrderContext.getOrderById`, Track Order page | `GET /orders/:id`, `POST /orders/track { orderId, email }` |
| `MessageContext` | `POST /contact`, `GET /admin/messages`, `PATCH`, `DELETE` |
| `SubscriberContext` | `POST /newsletter/subscribers`, `GET /admin/subscribers`, `DELETE` |
| `services/customerService.deriveCustomers` | `GET /admin/customers` |
| `services/dashboardService` | `GET /admin/dashboard` |
| `services/mediaService.uploadImage` | `POST /admin/media` (multipart) |
| `PaymentMethodForm` | Your processor's hosted fields (Stripe Elements, etc.) so raw card data never touches your code |

> **Security: read this before going live.**
> - Roles and sign-in are **UI gating only**. Anyone can edit `localStorage`. Real authorisation must be enforced on the server.
> - `getOrderById` is deliberately **not** scoped to the signed-in user, because guests need their confirmation page. A real API **must authorise it**. The Track Order page needs the same server-side email check, rate limiting, and must never return the address or payment.
> - `POST /contact` needs spam protection and server-side validation.
> - The card form is a UI demo. The full number is reduced to brand + last 4 immediately and is never stored.

## Admin dashboard definitions

Defined in `services/dashboardService.js`, so you can change them in one place.

| Figure | Definition |
|---|---|
| Revenue | Sum of `order.total` for orders that are **not Cancelled**. Same rule as a customer's "Total spent". |
| Orders (KPI) | Orders placed in the window, **excluding Cancelled** |
| KPI window | Last 30 days, compared with the 30 days before. A previous period of 0 shows "New". |
| In progress | Orders that are Processing or Shipped |
| Customers | Customers in the directory; the sub-line counts those with at least one non-cancelled order |
| Orders by status | Counts **every** order, so cancelled ones stay visible |
| Monthly revenue | Last 6 local calendar months, excluding Cancelled. The current month is incomplete. |
| Sales by category | Item value (`price × quantity`) from the order snapshots, excluding Cancelled. Tax and shipping cannot be attributed to a category, so this sums to **less than revenue**. |
| Top products | Top 5 by units sold, then revenue, excluding Cancelled. Names come from the snapshot. |

Customers' **Orders** column excludes Cancelled orders, like the Orders KPI. A customer whose only orders were cancelled therefore shows 0 orders next to a "Last order" date. That is intentional.

## Project structure

```
Heim/
├── public/
├── src/
│   ├── assets/               # images (see IMAGE-CREDITS.md)
│   ├── components/
│   │   ├── account/          # AccountLayout
│   │   ├── admin/            # AdminLayout, DataTable, PageHeader, StatCard,
│   │   │                     # DashboardCard, ColumnChart, BarList, RecentList
│   │   ├── auth/             # ProtectedRoute, AuthLayout, NotAuthorized, DemoHint
│   │   ├── checkout/         # CheckoutLayout, CheckoutGuard, CheckoutStepper,
│   │   │                     # OrderSummary, OptionCard
│   │   ├── forms/            # FormField, ImageField, Address/PaymentMethod/Product/
│   │   │                     # Category/BlogPost/Promo/Settings forms
│   │   ├── layout/           # Header, Footer
│   │   ├── sections/         # Home page sections
│   │   ├── ui/               # Button, Input, StatusBadge, EmptyState, ConfirmInline,
│   │   │                     # Breadcrumb, InfoPage, ProductCard, BlogCard,
│   │   │                     # NewsletterForm, ToastViewport
│   │   └── ScrollToTop.jsx
│   ├── config/
│   │   ├── site.js           # default store settings (re-branding starts here)
│   │   └── demo.js           # demo credentials
│   ├── context/              # one provider per concern + AppProviders
│   ├── data/                 # mock and seed data
│   ├── hooks/                # useLocalStorage, useSeededCollection
│   ├── pages/                # flat, hyphenated: Admin-products.jsx, Checkout-review.jsx ...
│   ├── services/             # pure functions (orders, products, promos, dashboard ...)
│   ├── utils/                # format, pricing, product, user, validators, constants,
│   │                         # storageKeys, checkoutSteps, payment, admin
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css             # Tailwind v4 @theme design tokens
├── IMAGE-CREDITS.md
├── index.html
├── vite.config.js
├── eslint.config.js
└── package.json
```

## Design system

Colours, fonts and animation are tokens in the `@theme` block of `src/index.css`. Use tokens, not raw palette colours (`bg-primary`, `text-foreground`, `border-border` ...). Change a token and the whole app follows.

| Token | Use |
|---|---|
| `background`, `card`, `secondary`, `muted` | Page, panel and band surfaces |
| `foreground`, `muted-foreground` | Text |
| `primary`, `primary-foreground` | Main buttons and dark surfaces |
| `accent`, `success`, `destructive` | Brand colours for **fills, rings, icons and chart bars** |
| `accent-text`, `success-text`, `destructive-text` | Darker variants for **small text** (the brand colours are too light for 4.5:1) |
| `rating` | Star ratings |
| `border`, `ring` | Borders and focus |

**Fonts:** Inter (sans) and Playfair Display (serif), loaded from Google Fonts in `index.css`.

**Shared components:**
- `Button`: variants `primary`, `outline`, `ghost`, `danger`, `inverse` (for dark surfaces); sizes `sm`, `md`, `lg`; render as a link with `<Button as={Link} to="...">`.
- `StatusBadge`: tones `neutral`, `success`, `accent`, `danger`.
- `DataTable`: column config `{ key, header, sortable?, sortValue?, align?, render? }`, search, sort, pagination, empty states, row actions, one expandable row, and an opt-in `syncToUrl` that keeps `?q`, `?sort` and `?page` in the URL.
- `PageHeader`, `FormField`, `ConfirmInline`, `EmptyState`, `StatCard`, `DashboardCard`, `ColumnChart`, `BarList` and `RecentList` make up the rest of the admin kit.

## Extending the template

**Re-brand.** Edit `src/config/site.js`, the tokens in `index.css`, `index.html`, `package.json` (`name`, `homepage`) and the prose listed in [Replace before going live](#text-and-branding-to-edit-in-code).

**Add a checkout step.** Add an entry to `CHECKOUT_STEPS` in `utils/checkoutSteps.js` (id, label, path, `showSummary`, `isComplete(draft)`), create the page, and add one `<Route>` in `App.jsx`. The stepper, the route guard and the Back/Continue links read that config.

**Add an order status.** Add an entry to `ORDER_STATUS_CONFIG` and a label to `ORDER_ACTION_LABELS` in `services/orderService.js`, and an icon to `ACTION_ICONS` in `pages/Admin-order-detail.jsx`. Check the walk in `data/orderSeed.js` (`STATUS_PATHS`) if you add seed orders.

**Add an admin page.** Create `pages/Admin-thing.jsx`, add a `<Route>` under `/admin` in `App.jsx`, and an entry in `ADMIN_NAV` in `AdminLayout.jsx`. Use `PageHeader` and `DataTable`; define `getRowId`, `searchText` and `COLUMNS` at module level so memoisation stays stable.

**Add a persisted collection.**
1. Add its key to `utils/storageKeys.js` (Reset picks it up automatically).
2. Write a pure `services/thingService.js`, and a memoised seed getter if it is seeded.
3. Create the context with `useSeededCollection`, with async mutations and mock latency.
4. Add the provider to the `PROVIDERS` array in `AppProviders.jsx`, **below** every provider it reads.
5. Bump `DATA_VERSION` only if you changed existing seed data.

**Enable image upload** (`ImageField` is disabled on purpose):
1. Add an `onChange(url)` prop to `ImageField` and remove `disabled` from the button and the URL input.
2. Add a hidden `<input type="file" accept={ALLOWED_IMAGE_TYPES.join(',')}>`. On change, run `validateImageFile(file)` and show its error, otherwise `await uploadImage(file)` and call `onChange(result.url)`.
3. In `ProductForm`, `CategoryForm` and `BlogPostForm` keep the URL in state and add `image` to the submitted payload. Update `createProduct`/`applyProductInput`, `createCategory`/`applyCategoryInput` and `createPost`/`applyPostInput`, which ignore `image` today.
4. **Do not keep data URLs in `localStorage`**: they hit the browser quota quickly. Replace `uploadImage` with a real endpoint first.

## Accessibility

- Every form field has a label; errors use `aria-invalid` and `aria-describedby` and a failed submit focuses the first invalid field (the two auth forms are the exception, see [Known limits](#known-limits))
- Admin pages focus their `<h1>` on mount, so route changes are announced
- Inline confirmations move focus to Cancel, close on Escape and return focus to the trigger
- Tables use captions and `aria-sort`; the result count is announced when search or filters change
- Dashboard charts are `role="img"` with an `aria-label`, **plus** a visually hidden data table next to each one. Values are always printed, never colour-only.
- Toasts use polite and assertive live regions; errors never auto-dismiss; hover or focus pauses the timer
- Small text uses the `*-text` tokens for at least 4.5:1 contrast against its background

## Deployment

The template is configured for **GitHub Pages under `/Heim`**:

- `vite.config.js`: `base: "/Heim"`
- `App.jsx`: `<BrowserRouter basename="/Heim">`
- `package.json`: `homepage`

To deploy elsewhere (Netlify, Vercel, your own domain), change all three to match your path (use `/` for a domain root).

**Deep-link refresh on GitHub Pages.** GitHub Pages cannot rewrite unknown paths, so refreshing a client-side route such as `/Heim/account/orders` shows GitHub's 404. The app itself works because navigation happens in the browser. Fixes: host somewhere that supports SPA rewrites (a single rule that serves `index.html` for every path), or add a `404.html` redirect trick, or switch to `HashRouter`. "Reset demo data" deliberately does not reload the page for this reason.

## Known limits

- **Everything is per-browser.** Data lives in `localStorage` (about 5 MB). Nothing is shared between devices or users.
- **A sign-up that never orders is not in the Customers directory.** Sign-ups are not persisted, so the directory is built from the seed pool plus the emails found in orders. Customers who exist only in orders take their name and location from their **latest order's shipping address**, which can be a gift recipient.
- **Guest orders show up for anyone who later signs in with the same email.** Orders are matched to accounts by email.
- **Seed dates are relative to the last page load**, not to when you reset.
- **A dropped promo lingers in storage until dismissed.** If an admin deactivates a code under a customer, the cart shows a dismissible notice, but re-activating the code silently restores the discount. There is no promo notice on the checkout Review step.
- **"Delete account" only signs out.** It does not clear the cart, wishlist or saved data.
- **Account → Addresses and Wallet "Remove" has no confirmation**, unlike the admin pages.
- **The Settings form reads settings once on mount.**
- **`DATA_VERSION` is global.** Changing seed data resets every seeded collection, including visitor-submitted messages and subscribers.
- **Demo placeholders that do nothing:** the Google and Facebook sign-in buttons, the "Remember me" checkbox and the product-page share buttons.
- **Accessibility gaps you should know about:** `muted-foreground` text on `secondary` surfaces is about 4.2:1 (borderline); the unread-count badges in the header and admin sidebar are about 4.4:1; the SignIn and SignUp forms do not yet wire `aria-invalid` and `aria-describedby` to their errors; Safari does not focus buttons on click, so "return focus to the trigger" works for keyboard users only there.
- **Shared images.** See [Images](#images).

## Credits

- Images: see [`IMAGE-CREDITS.md`](IMAGE-CREDITS.md). Faces and products in them are fictional.
- Icons: [Lucide](https://lucide.dev/). Fonts: Inter and Playfair Display (Google Fonts).
- Built with React, Vite, Tailwind CSS, React Router and gh-pages.

## Contact

- Email: ilhambouktir8@gmail.com
- LinkedIn: [Ilham Bouktir](https://www.linkedin.com/in/ilham-bouktir-0b266b31b)
- GitHub: https://github.com/ilham-bouk
- Portfolio: [Ilham Bouktir](https://ilham-bouk.github.io/ilhambouktir/)

For questions, open a GitHub issue.