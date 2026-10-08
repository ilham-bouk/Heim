import { createContext, useContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/storageKeys';
import { useCatalog } from './CatalogContext';

const WishlistContext = createContext();

const WISHLIST_STORAGE_KEY = STORAGE_KEYS.wishlist;

// Storage keeps product IDs only; products are resolved from the live catalog.
// Older saved wishlists hold full product copies, so entries are normalised to IDs on read.
const toId = (entry) => (typeof entry === 'object' ? entry.id : entry);

export const WishlistProvider = ({ children }) => {
  const { getProductById } = useCatalog();
  const [storedEntries, setStoredEntries] = useLocalStorage(WISHLIST_STORAGE_KEY, []);

  const wishlistItems = useMemo(
    () =>
      storedEntries.flatMap((entry) => {
        const product = getProductById(toId(entry));
        return product ? [product] : [];
      }),
    [storedEntries, getProductById]
  );

  const addToWishlist = (product) => {
    setStoredEntries((prev) => {
      const ids = prev.map(toId);
      return ids.includes(product.id) ? ids : [...ids, product.id];
    });
  };

  const removeFromWishlist = (productId) => {
    setStoredEntries((prev) => prev.map(toId).filter((id) => id !== productId));
  };

  const toggleWishlist = (product) => {
    setStoredEntries((prev) => {
      const ids = prev.map(toId);
      return ids.includes(product.id) ? ids.filter((id) => id !== product.id) : [...ids, product.id];
    });
  };

  const isInWishlist = (productId) => wishlistItems.some((item) => item.id === productId);

  const clearWishlist = () => setStoredEntries([]);

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
    wishlistCount: wishlistItems.length,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};