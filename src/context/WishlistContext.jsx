import { createContext, useState, useContext } from 'react';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  // Use functional updater to avoid stale closure bugs
  const addToWishlist = (product) => {
    setWishlistItems(prev => {
      if (prev.find(item => item.id === product.id)) return prev;
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems(prev => prev.filter(item => item.id !== productId));
  };

  const toggleWishlist = (product) => {
    setWishlistItems(prev =>
      prev.find(item => item.id === product.id)
        ? prev.filter(item => item.id !== product.id)
        : [...prev, product]
    );
  };

  const isInWishlist = (productId) =>
    wishlistItems.some(item => item.id === productId);

  const clearWishlist = () => setWishlistItems([]);

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
    wishlistCount: wishlistItems.length,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};