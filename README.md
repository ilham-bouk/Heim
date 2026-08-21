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

### Preview

![Heim Mockup](src/assets/Mockup.png)

### Live Demo

Live Site URL: [View TrueCuisine](https://ilham-bouk.github.io/Heim/)

### Features

- Responsive multi-page UI suitable for desktop and mobile
- Product listing and detail pages
- Client-side routing with React Router
- Cart & Wishlist UI (local state)
- Auth UI mockups for Sign In / Sign Up
- Blog and blog detail pages for content marketing
- Search/filter basics on Shop page
- Modern UI built with Tailwind CSS and Lucide React icons 

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
