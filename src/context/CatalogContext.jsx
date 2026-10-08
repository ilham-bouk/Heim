import { createContext, useCallback, useContext, useMemo } from 'react';
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
} from '../services/productService';

const CatalogContext = createContext();

/**
 * Products + categories (kept together: renaming/deleting a category affects
 * products, and category counts are derived from products).
 *
 * Product shape:
 * { id, name, price, discount?, image, rating, reviews, category, badge?,
 *   featured?, createdAt (ISO), description, specs?: [{ label, value }] }
 * Category shape: { id, name, image }  (itemCount is derived, see `categories`)
 *
 * Real backend: replace the persistence inside this provider with fetches;
 * the values it exposes can stay the same.
 */
export const CatalogProvider = ({ children }) => {
  const [products] = useSeededCollection(STORAGE_KEYS.products, getSeedProducts);
  const [rawCategories] = useSeededCollection(STORAGE_KEYS.categories, getSeedCategories);

  const categories = useMemo(() => withItemCounts(rawCategories, products), [rawCategories, products]);
  const getProductById = useCallback((id) => findProductById(products, id), [products]);

  const value = useMemo(
    () => ({
      products,
      categories,
      getProductById,
      getFeaturedProducts: (limit) => selectFeaturedProducts(products, limit),
      getNewestProducts: (limit) => selectNewestProducts(products, limit),
      getRelatedProducts: (product, limit) => selectRelatedProducts(products, product, limit),
    }),
    [products, categories, getProductById]
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
};

export const useCatalog = () => {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error('useCatalog must be used within a CatalogProvider');
  }
  return context;
};