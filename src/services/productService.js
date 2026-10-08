// Product data helpers: PURE functions over arrays.
// Persistence and state live in context/CatalogContext.jsx; this file holds
// the seed data and the selection logic.
//
// To wire a real backend: replace the seed getters with API calls and have
// CatalogContext fetch instead of reading localStorage. Selectors that take
// arrays can stay (or move server-side as query params).

import { products, categories } from '../data/mockData';

export const getSeedProducts = () => products;
export const getSeedCategories = () => categories;

export const findProductById = (list, id) =>
  list.find((product) => product.id === Number(id)) || null;

export const selectFeaturedProducts = (list, limit = 4) =>
  list.filter((product) => product.featured).slice(0, limit);

export const selectNewestProducts = (list, limit = 4) =>
  [...list]
    .sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''))
    .slice(0, limit);

export const selectRelatedProducts = (list, product, limit = 4) =>
  list
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit);

// Category item counts are derived from the live catalog, never stored.
export const withItemCounts = (categoryList, productList) =>
  categoryList.map((category) => ({
    ...category,
    itemCount: productList.filter((product) => product.category === category.name).length,
  }));