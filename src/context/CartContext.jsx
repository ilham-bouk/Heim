import { createContext, useContext, useMemo } from 'react';
import { calculateTotals } from '../utils/pricing';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/storageKeys';
import { validatePromo } from '../services/promoService';
import { useCatalog } from './CatalogContext';
import { usePromos } from './PromoContext';
import { useSettings } from './SettingsContext';

const CartContext = createContext();

const CART_STORAGE_KEY = STORAGE_KEYS.cart;
const PROMO_STORAGE_KEY = STORAGE_KEYS.cartPromo;

// Storage keeps only { id, quantity } per line and { code } for the promo.
// Everything else (name, price, discount, promo type/value...) is resolved against
// the live catalog and promo list on every render, so admin edits apply immediately
// and deleted products or promos drop out. (Older saved carts hold full product
// copies; we only read id/quantity.)
// Real backend: this is the shape a cart API returns.

export const CartProvider = ({ children }) => {
  const { getProductById } = useCatalog();
  const { promos } = usePromos();
  const { settings } = useSettings();
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

  // A stored code only counts while it is still valid (exists, active, not expired).
  // If an admin changes that under the customer, the discount disappears and
  // `droppedPromo` explains why, so the total never changes silently.
  const promoCheck = storedPromo ? validatePromo(promos, storedPromo.code) : null;
  const appliedPromo = promoCheck?.ok ? promoCheck.promo : null;
  const droppedPromo = promoCheck && !promoCheck.ok ? { code: storedPromo.code, reason: promoCheck.error } : null;

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

  // Returns { ok: true } or { ok: false, error }. Swap for an API call later
  // (a real API should return one generic error for every failure).
  const applyPromo = (rawCode) => {
    if (appliedPromo) {
      const sameCode = appliedPromo.code === rawCode.trim().toUpperCase();
      return {
        ok: false,
        error: sameCode
          ? `“${appliedPromo.code}” is already applied.`
          : `Remove “${appliedPromo.code}” before applying another code.`,
      };
    }

    const result = validatePromo(promos, rawCode);
    if (!result.ok) return result;

    setStoredPromo({ code: result.promo.code });
    return { ok: true };
  };

  // Also used to dismiss the "promo was removed" notice (it clears the stale code).
  const removePromo = () => setStoredPromo(null);

  const { subtotal, shipping, tax, discount, total } = calculateTotals(cartItems, appliedPromo, settings.pricing);

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
    droppedPromo,
    applyPromo,
    removePromo,
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