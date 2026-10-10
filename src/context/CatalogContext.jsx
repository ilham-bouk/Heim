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
 * Mutations (admin): addProduct(input), updateProduct(id, input), deleteProduct(id) — all return Promises.
 *
 * Real backend: replace the persistence inside this provider with fetches;
 * the values it exposes can stay the same.
 */
export const CatalogProvider = ({ children }) => {
  const [products, setProducts] = useSeededCollection(STORAGE_KEYS.products, getSeedProducts);
  const [rawCategories] = useSeededCollection(STORAGE_KEYS.categories, getSeedCategories);
  const [idCounters, setIdCounters] = useLocalStorage(STORAGE_KEYS.idCounters, {});

  const categories = useMemo(() => withItemCounts(rawCategories, products), [rawCategories, products]);
  const getProductById = useCallback((id) => findProductById(products, id), [products]);

  const value = useMemo(() => {
    // IDs are never reused, even after a delete: old carts and order snapshots
    // could otherwise point at a different product. Real backend: the server assigns the ID.
    const reserveProductId = () => {
      const id = Math.max(0, idCounters.products ?? 0, ...products.map((p) => p.id)) + 1;
      setIdCounters((prev) => ({ ...prev, products: id }));
      return id;
    };

    // Mutations are async (mock latency) so swapping in fetch calls changes nothing for callers.
    // Real backend: addProduct → POST /products, updateProduct → PATCH /products/:id,
    // deleteProduct → DELETE /products/:id.
    const addProduct = async (input) => {
      const product = createProduct(input, reserveProductId());
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
    };
  }, [products, categories, getProductById, idCounters, setProducts, setIdCounters]);

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
};

export const useCatalog = () => {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error('useCatalog must be used within a CatalogProvider');
  }
  return context;
};