import { createContext, useCallback, useContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useSeededCollection } from '../hooks/useSeededCollection';
import { STORAGE_KEYS } from '../utils/storageKeys';
import {
  getSeedProducts,
  getSeedCategories,
  findProductById,
  selectFeaturedProducts,
  selectNewestProducts,
  selectRelatedProducts,
  withItemCounts,
  createProduct,
  applyProductInput,
  isCategoryNameTaken,
  createCategory,
  applyCategoryInput,
  renameProductCategory,
} from '../services/productService';

const CatalogContext = createContext();

const MOCK_LATENCY_MS = 400; // simulated network delay — remove when wiring a real API
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Products + categories (kept together: renaming/deleting a category affects
 * products, and category counts are derived from products).
 *
 * Product shape:
 * { id, name, price, discount?, image, rating, reviews, category, badge?,
 *   featured?, createdAt (ISO), description, specs?: [{ label, value }] }
 * Category shape: { id, name, image }  (itemCount is derived, see `categories`)
 * Mutations (admin): addProduct(input), updateProduct(id, input), deleteProduct(id), addCategory(input), updateCategory(id, input) and deleteCategory(id) — all return Promises.
 *
 * Real backend: replace the persistence inside this provider with fetches;
 * the values it exposes can stay the same.
 */
export const CatalogProvider = ({ children }) => {
  const [products, setProducts] = useSeededCollection(STORAGE_KEYS.products, getSeedProducts);
  const [rawCategories, setRawCategories] = useSeededCollection(STORAGE_KEYS.categories, getSeedCategories);
  const [idCounters, setIdCounters] = useLocalStorage(STORAGE_KEYS.idCounters, {});

  const categories = useMemo(() => withItemCounts(rawCategories, products), [rawCategories, products]);
  const getProductById = useCallback((id) => findProductById(products, id), [products]);

  const value = useMemo(() => {
    // IDs are never reused, even after a delete: old carts and order snapshots
    // could otherwise point at a different product. Real backend: the server assigns the ID.
    const reserveId = (kind, items) => {
      const id = Math.max(0, idCounters[kind] ?? 0, ...items.map((item) => item.id)) + 1;
      setIdCounters((prev) => ({ ...prev, [kind]: id }));
      return id;
    };

    // Mutations are async (mock latency) so swapping in fetch calls changes nothing for callers.
    // Real backend: POST /products, PATCH /products/:id, DELETE /products/:id (same for /categories).
    const addProduct = async (input) => {
      const product = createProduct(input, reserveId('products', products));
      await delay(MOCK_LATENCY_MS);
      setProducts((prev) => [...prev, product]);
      return product;
    };

    const updateProduct = async (id, input) => {
      await delay(MOCK_LATENCY_MS);
      setProducts((prev) => prev.map((p) => (p.id === id ? applyProductInput(p, input) : p)));
    };

    const deleteProduct = async (id) => {
      await delay(MOCK_LATENCY_MS);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    };

    const assertNameAvailable = (name, ignoreId) => {
      if (isCategoryNameTaken(rawCategories, name, ignoreId)) {
        throw new Error(`A category named “${name.trim()}” already exists.`);
      }
    };

    const addCategory = async (input) => {
      assertNameAvailable(input.name, null);
      const category = createCategory(input, reserveId('categories', rawCategories));
      await delay(MOCK_LATENCY_MS);
      setRawCategories((prev) => [...prev, category]);
      return category;
    };

    // Renaming cascades to the category's products so nothing is left pointing at the old name.
    const updateCategory = async (id, input) => {
      const current = rawCategories.find((c) => c.id === id);
      if (!current) throw new Error('This category no longer exists.');
      assertNameAvailable(input.name, id);

      await delay(MOCK_LATENCY_MS);
      const nextName = input.name.trim();
      setRawCategories((prev) => prev.map((c) => (c.id === id ? applyCategoryInput(c, input) : c)));
      if (nextName !== current.name) {
        setProducts((prev) => renameProductCategory(prev, current.name, nextName));
      }
    };

    // Blocked while products use it (cascade-deleting products is too destructive).
    const deleteCategory = async (id) => {
      const current = rawCategories.find((c) => c.id === id);
      if (!current) return;

      const inUse = products.filter((p) => p.category === current.name).length;
      if (inUse > 0) {
        throw new Error(`“${current.name}” still has ${inUse} ${inUse === 1 ? 'product' : 'products'}. Move or delete them first.`);
      }

      await delay(MOCK_LATENCY_MS);
      setRawCategories((prev) => prev.filter((c) => c.id !== id));
    };

    return {
      products,
      categories,
      getProductById,
      getFeaturedProducts: (limit) => selectFeaturedProducts(products, limit),
      getNewestProducts: (limit) => selectNewestProducts(products, limit),
      getRelatedProducts: (product, limit) => selectRelatedProducts(products, product, limit),
      addProduct,
      updateProduct,
      deleteProduct,
      addCategory,
      updateCategory,
      deleteCategory,
    };
  }, [products, rawCategories, categories, getProductById, idCounters, setProducts, setRawCategories, setIdCounters]);

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
};

export const useCatalog = () => {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error('useCatalog must be used within a CatalogProvider');
  }
  return context;
};