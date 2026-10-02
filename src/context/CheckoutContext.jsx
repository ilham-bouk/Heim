import { createContext, useCallback, useContext, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const CheckoutContext = createContext();

const CHECKOUT_STORAGE_KEY = 'heim_checkout_draft';

/**
 * Checkout draft (persisted so a refresh mid-checkout doesn't lose progress):
 * {
 *   shippingAddress: Address | null,   // a SNAPSHOT (copy), not a live reference
 *   payment: { id, brand, last4, expMonth, expYear, cardholderName } | null,
 *   email: string,
 *   isGuest: boolean
 * }
 * Step completion is DERIVED from this data (see utils/checkoutSteps.js), never stored.
 */
const EMPTY_DRAFT = { shippingAddress: null, payment: null, email: '', isGuest: false };

export const CheckoutProvider = ({ children }) => {
  const [draft, setDraft] = useLocalStorage(CHECKOUT_STORAGE_KEY, EMPTY_DRAFT);

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const updateDraft = (updates) => setDraft((prev) => ({ ...prev, ...updates }));
  const resetCheckout = useCallback(() => setDraft(EMPTY_DRAFT), [setDraft]);

  const value = { draft, updateDraft, resetCheckout, isPlacingOrder, setIsPlacingOrder };

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>;
};

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
};