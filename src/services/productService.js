// Product data helpers: PURE functions over arrays.
// Persistence and state live in context/CatalogContext.jsx; this file holds
// the seed data and the selection logic.
//
// To wire a real backend: replace the seed getters with API calls and have
// CatalogContext fetch instead of reading localStorage. Selectors that take
// arrays can stay (or move server-side as query params).

import { products, categories } from '../data/mockData';
import placeholderImage from '../assets/product-placeholder.svg';

export const getSeedProducts = () => products;
export const getSeedCategories = () => categories;

export const PLACEHOLDER_PRODUCT_IMAGE = placeholderImage;
export const PLACEHOLDER_CATEGORY_IMAGE = placeholderImage;

// The admin form edits these four spec rows (same labels as the seed data).
export const SPEC_LABELS = ['Dimensions', 'Material', 'Weight', 'Color'];

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

// Optional fields are removed (not stored as 0 / '') when empty: the storefront
// checks `product.discount && …`, which would render a stray "0".
const withOptionalFields = (product, { discount, badge, specs }) => {
  const next = { ...product };
  if (discount > 0) next.discount = discount; else delete next.discount;
  if (badge) next.badge = badge; else delete next.badge;
  if (specs?.length) next.specs = specs; else delete next.specs;
  return next;
};

/**
 * Builds a new product from admin input.
 * Real backend: the server does this and returns the created product.
 * @param {{name, category, price, discount, badge, featured, description, specs}} input
 * @param {number} id
 */
export const createProduct = (input, id) =>
  withOptionalFields(
    {
      id,
      name: input.name,
      category: input.category,
      price: input.price,
      featured: input.featured,
      description: input.description,
      image: PLACEHOLDER_PRODUCT_IMAGE,
      rating: 0,
      reviews: 0,
      createdAt: new Date().toISOString(),
    },
    input
  );

/** Applies admin input to an existing product; id, image, rating, reviews and createdAt are kept. */
export const applyProductInput = (product, input) =>
  withOptionalFields(
    {
      ...product,
      name: input.name,
      category: input.category,
      price: input.price,
      featured: input.featured,
      description: input.description,
    },
    input
  );

// Category names are matched case-insensitively (products reference them by name).
export const isCategoryNameTaken = (categoryList, name, ignoreId = null) => {
  const wanted = name.trim().toLowerCase();
  return categoryList.some((c) => c.id !== ignoreId && c.name.trim().toLowerCase() === wanted);
};

/** Real backend: the server builds the category and returns it. */
export const createCategory = ({ name }, id) => ({
  id,
  name: name.trim(),
  image: PLACEHOLDER_CATEGORY_IMAGE,
});

export const applyCategoryInput = (category, { name }) => ({ ...category, name: name.trim() });

/** Cascade for a category rename: products reference their category by name. */
export const renameProductCategory = (productList, from, to) =>
  productList.map((product) => (product.category === from ? { ...product, category: to } : product));