# Heim — Furniture E‑commerce

A multi-page e-commerce website built with React and Vite for selling furniture. Heim includes a complete storefront experience with pages for browsing, product details, blog content, and user flows such as sign-in, cart, wishlist, and checkout-ready UI.

## Table of Contents

- [Overview](#overview)
  - [Preview](#preview)
  - [Live Demo](#live-demo)
  - [Features](#features)
- [Features](#features)
- [Pages](#pages)
- [Built with](#built-with)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Contact](#contact)

## Overview

Heim is a modern, multi-page e-commerce storefront crafted for showcasing and selling furniture. It delivers a polished, responsive shopping experience with a clear focus on product discovery and conversion — featuring a browsable Shop, rich Product Detail pages, a lightweight Cart and Wishlist, and content-driven Blog pages to support marketing. The UI is designed for both desktop and mobile users, providing fast interactions, intuitive product filtering/search, and streamlined user flows for signing in/up and managing purchases, all wrapped in a cohesive visual system built with Tailwind CSS and Lucide icons.

Under the hood, Heim is built with React and Vite for a snappy development experience and production build, and uses React Router for client-side navigation and Context (or similar local state) for cart and wishlist state. Its component-driven architecture makes it easy to extend or replace parts — for example, swapping mock data for a headless CMS, integrating a payments provider like Stripe, or adding persistent auth. The project is optimized for quick iteration and deployment (currently hosted on GitHub Pages), and follows best practices for accessibility and performance so it’s ready to be adapted into a full production storefront or used as a polished demo for portfolio and client work.

### Preview

![Heim Mockup](src/assets/Mockup.png)

### Live Demo

Live Site URL: [View TrueCuisine](https://ilham-bouk.github.io/Heim/)

### Features

- Responsive multi-page UI suitable for desktop and mobile
Product listing and detail pages with image gallery
 
- Client-side routing with React Router
- Cart & Wishlist UI (local state, ready to be hooked to a backend) 
- Auth UI mockups for Sign In / Sign Up
- Blog and blog detail pages for content marketing
- Search/filter basics on Shop page
- Modern UI built with Tailwind CSS and Lucide React icons
- Accessibility & Performance
    - Use semantic HTML and ARIA attributes where appropriate.
    - Provide descriptive alt text for images.
    - Lazy-load large images and defer non-critical resources.

---

## Pages
- Home
- Shop (product listing)
- Product Detail
- About
- Blog
- Blog Detail
- Contact
- Cart
- Wishlist
- Sign In
- Sign Up
- Not Found (404)

---

## Built with

### Technologies and Libraries Used

- **React** (v19): UI framework for dynamic interfaces
- **Vite**: Lightning fast development environment and build tooling
- **React Router**
- **Tailwind CSS** (v4): Utility-first CSS framework for design
- **Lucide React**: Icon library for consistent, crisp icons
- **gh-pages**: Deployment utility for publishing to GitHub Pages
- **ESLint**: Code linting and quality enforcement

---

## Project Structure

```
Heim/
├── public/                
├── src/
│   ├── assets/           
│   ├── components/
│   │   ├── auth/
│   │   ├── layout/ 
│   │   ├── sections/ 
│   │   ├── ui/ 
│   ├── pages/       
│   ├── context/      
│   ├── data/       
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── eslint.config.js      
└── README.md             
```

---

## Installation

To get started, ensure you have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed on your machine.

1. **Clone the repository:**
   ```sh
   git clone https://github.com/ilham-bouk/Heim.git
   cd Heim
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Start development server:**
   ```sh
   npm run dev
   ```
   Visit `http://localhost:5173` (Vite default) to preview the app in your browser.

4. **Build for production:**
   ```sh
   npm run build
   ```
   The built site will be output to the `dist/` folder.

5. **Preview production build locally:**
   ```sh
   npm run preview
   ```

6. **Deploy to GitHub Pages:**
   ```sh
   npm run deploy
   ```
   *(Deployment uses `gh-pages` and Vite config for correct base path.)*

---

## Contact

- Email: ilhambouktir8@gmail.com
- LinkedIn: [Ilham Bouktir](https://www.linkedin.com/in/ilham-bouktir-0b266b31b)
- GitHub: https://github.com/ilham-bouk
- Portfolio: [Ilham Bouktir](https://ilham-bouk.github.io/ilhambouktir/)

For any questions, reach out via GitHub Issues!
