// Product data service.
// This is the ONLY file that should import from `data/mockData.js` for
// product/category data. Components call these functions instead of
// reaching into mock data directly — so swapping in a real API later
// means editing this one file, not every component that lists products.
//
// To wire a real backend: replace each function body with a `fetch`/axios
// call. If your API is async, mark these functions `async` and add
// loading/error state where they're consumed (useEffect + useState, or
// your data-fetching library of choice).

import { products, categories } from '../data/mockData';

export const getProducts = () => products;

export const getProductById = (id) =>
  products.find((product) => product.id === Number(id)) || null;

export const getProductsByCategory = (category) =>
  category ? products.filter((product) => product.category === category) : products;

export const getFeaturedProducts = (limit = 4) => products.slice(0, limit);

export const getRelatedProducts = (product, limit = 4) =>
  products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit);

export const getCategories = () => categories;