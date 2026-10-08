import { createContext, useContext, useMemo } from 'react';
import { getFinalPrice } from '../utils/product';
import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_COST, TAX_RATE, PROMO_CODES } from '../utils/constants';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/storageKeys';
import { useCatalog } from './CatalogContext';

const CartContext = createContext();

const CART_STORAGE_KEY = STORAGE_KEYS.cart;
const PROMO_STORAGE_KEY = STORAGE_KEYS.cartPromo;

// Storage keeps only { id, quantity } per line and { code } for the promo.
// Everything else (name, price, discount, rate...) is resolved against the live
// catalog on every render, so admin edits apply immediately and deleted products
// drop out. (Older saved carts hold full product copies; we only read id/quantity.)
// Real backend: this is the shape a cart API returns.

export const CartProvider = ({ children }) => {
  const { getProductById } = useCatalog();
  const [storedItems, setStoredItems] = useLocalStorage(CART_STORAGE_KEY, []);
  const [storedPromo, setStoredPromo] = useLocalStorage(PROMO_STORAGE_KEY, null);

  const cartItems = useMemo(
    () =>
      storedItems.flatMap(({ id, quantity }) => {
        const product = getProductById(id);
        return product ? [{ ...product, quantity }] : [];
      }),
    [storedItems, getProductById]
  );

  // Lines whose product no longer exists in the catalog.
  const unavailableCount = storedItems.length - cartItems.length;

  const promoRate = storedPromo ? PROMO_CODES[storedPromo.code] : undefined;
  const appliedPromo = promoRate ? { code: storedPromo.code, rate: promoRate } : null;

  const addToCart = (product, quantity = 1) => {
    setStoredItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { id: item.id, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { id: product.id, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setStoredItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setStoredItems((prev) =>
      prev.map((item) => (item.id === productId ? { id: item.id, quantity } : item))
    );
  };

  const clearCart = () => {
    setStoredItems([]);
    setStoredPromo(null);
  };

  // Drops lines whose product was deleted from the catalog.
  const clearUnavailable = () => {
    setStoredItems((prev) => prev.filter((item) => getProductById(item.id)));
  };

  // Returns { ok: true } or { ok: false, error }. Swap for an API call later.
  const applyPromo = (rawCode) => {
    const code = rawCode.trim().toUpperCase();
    if (!PROMO_CODES[code]) return { ok: false, error: 'Invalid promo code' };

    setStoredPromo({ code });
    return { ok: true };
  };

  const subtotal = cartItems.reduce((total, item) => total + getFinalPrice(item) * item.quantity, 0);

  const shipping = cartItems.length === 0
    ? 0
    : subtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : STANDARD_SHIPPING_COST;
  const tax = Math.round(subtotal * TAX_RATE);

  // Mock simplification: shipping/tax are computed on the pre-discount subtotal.
  const discount = appliedPromo ? Math.round(subtotal * appliedPromo.rate) : 0;
  const total = subtotal + shipping + tax - discount;

  const value = {
    cartItems,
    unavailableCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    clearUnavailable,
    subtotal,
    shipping,
    tax,
    discount,
    appliedPromo,
    applyPromo,
    total,
    itemCount: cartItems.reduce((count, item) => count + item.quantity, 0),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};