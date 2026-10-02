import { createContext, useContext } from 'react';
import { getFinalPrice } from '../utils/product';
import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_COST, TAX_RATE, PROMO_CODES } from '../utils/constants';
import { useLocalStorage } from '../hooks/useLocalStorage';

const CartContext = createContext();

const CART_STORAGE_KEY = 'heim_cart_items';
const PROMO_STORAGE_KEY = 'heim_cart_promo';

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useLocalStorage(CART_STORAGE_KEY, []);
  const [appliedPromo, setAppliedPromo] = useLocalStorage(PROMO_STORAGE_KEY, null); // { code, rate }

  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prevItems, { ...product, quantity }];
    });
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
    setAppliedPromo(null);
  };

  // Returns { ok: true } or { ok: false, error }. Swap for an API call later.
  const applyPromo = (rawCode) => {
    const code = rawCode.trim().toUpperCase();
    const rate = PROMO_CODES[code];
    if (!rate) return { ok: false, error: 'Invalid promo code' };
    
    setAppliedPromo({ code, rate });
    return { ok: true };
  };

  // Calculate totals
  const subtotal = cartItems.reduce((total, item) => {
    return total + (getFinalPrice(item) * item.quantity);
  }, 0);

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
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    shipping,
    tax,
    discount,
    appliedPromo,
    applyPromo,
    total,
    itemCount: cartItems.reduce((count, item) => count + item.quantity, 0)
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};