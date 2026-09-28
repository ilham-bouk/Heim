import { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const PaymentMethodContext = createContext();

const PAYMENT_STORAGE_KEY = 'heim_payment_methods';

const detectBrand = (cardNumber) => {
  const digit = cardNumber.trim()[0];
  if (digit === '4') return 'Visa';
  if (digit === '5') return 'Mastercard';
  if (digit === '3') return 'Amex';
  if (digit === '6') return 'Discover';
  return 'Card';
};

/**
 * Payment method shape:
 * {
 *   id: string,
 *   brand: 'Visa' | 'Mastercard' | 'Amex' | 'Discover' | 'Card',
 *   last4: string,
 *   expMonth: string,  // '01'-'12'
 *   expYear: string,   // e.g. '2028'
 *   cardholderName: string,
 *   isDefault: boolean
 * }
 *
 * Deliberately does NOT store the full card number, even in this mock/
 * localStorage-backed form — only the derived brand + last4 are kept,
 * mirroring what a real processor's client SDK (Stripe, etc.)
 */

export const PaymentMethodProvider = ({ children }) => {
  const [paymentMethods, setPaymentMethods] = useLocalStorage(PAYMENT_STORAGE_KEY, []);

  const addPaymentMethod = ({ cardNumber, cardholderName, expMonth, expYear, isDefault }) => {
    const newMethod = {
      id: `pm_${Date.now()}`,
      brand: detectBrand(cardNumber),
      last4: cardNumber.trim().slice(-4),
      expMonth,
      expYear,
      cardholderName,
      isDefault: paymentMethods.length === 0 ? true : !!isDefault,
    };

    setPaymentMethods(prev => {
      const next = newMethod.isDefault
        ? prev.map(m => ({ ...m, isDefault: false }))
        : prev;
      return [...next, newMethod];
    });
  };

  const removePaymentMethod = (id) => {
    setPaymentMethods(prev => {
      const filtered = prev.filter(m => m.id !== id);
      if (filtered.length > 0 && !filtered.some(m => m.isDefault)) {
        filtered[0] = { ...filtered[0], isDefault: true };
      }
      return filtered;
    });
  };

  const setDefaultPaymentMethod = (id) => {
    setPaymentMethods(prev => prev.map(m => ({ ...m, isDefault: m.id === id })));
  };

  const value = {
    paymentMethods,
    addPaymentMethod,
    removePaymentMethod,
    setDefaultPaymentMethod,
  };

  return (
    <PaymentMethodContext.Provider value={value}>
      {children}
    </PaymentMethodContext.Provider>
  );
};

export const usePaymentMethods = () => {
  const context = useContext(PaymentMethodContext);
  if (!context) {
    throw new Error('usePaymentMethods must be used within a PaymentMethodProvider');
  }
  return context;
};