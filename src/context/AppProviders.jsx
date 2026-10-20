import { Fragment, createContext, useCallback, useContext, useState } from 'react';
import { AuthProvider } from './AuthContext';
import { CatalogProvider } from './CatalogContext';
import { BlogProvider } from './BlogContext';
import { SettingsProvider } from './SettingsContext';
import { PromoProvider } from './PromoContext';
import { SubscriberProvider } from './SubscriberContext';
import { MessageProvider } from './MessageContext';
import { CartProvider } from './CartContext';
import { WishlistProvider } from './WishlistContext';
import { AddressProvider } from './AddressContext';
import { PaymentMethodProvider } from './PaymentMethodContext';
import { OrderProvider } from './OrderContext';
import { CheckoutProvider } from './CheckoutContext';
import { getResettableKeys } from '../utils/storageKeys';

const ResetContext = createContext(null);

// Outermost first. ORDER MATTERS: a provider can only read providers listed
// above it. Cart and Wishlist resolve products from the catalog, and Cart
// resolves promos and reads pricing rules from Settings, so Catalog, Settings
// and Promos come before them.
// Rendering inside <ToastProvider> and <BrowserRouter> is assumed.
const PROVIDERS = [
  AuthProvider,
  CatalogProvider,
  BlogProvider,
  SettingsProvider,
  PromoProvider,
  SubscriberProvider,
  MessageProvider,
  CartProvider,
  WishlistProvider,
  AddressProvider,
  PaymentMethodProvider,
  OrderProvider,
  CheckoutProvider,
];

/**
 * Composes the providers above and owns "Reset demo data" (see useResetDemoData).
 *
 * Resetting clears every persisted key except the signed-in user, then changes
 * `resetKey`, which remounts the whole tree so every provider re-reads storage
 * and starts from its seed/defaults. No page reload: the URL stays put (a reload
 * would 404 on GitHub Pages deep links). The Toast provider and the router sit
 * outside, so they survive.
 */
const AppProviders = ({ children }) => {
  const [resetKey, setResetKey] = useState(0);

  const resetDemoData = useCallback(() => {
    let cleared = true;
    getResettableKeys().forEach((key) => {
      try {
        window.localStorage.removeItem(key);
      } catch {
        cleared = false; // storage disabled: nothing was persisted anyway
      }
    });
    setResetKey((key) => key + 1);
    return cleared;
  }, []);

  const tree = PROVIDERS.reduceRight((acc, Provider) => <Provider>{acc}</Provider>, children);

  return (
    <ResetContext.Provider value={resetDemoData}>
      <Fragment key={resetKey}>{tree}</Fragment>
    </ResetContext.Provider>
  );
};

/**
 * Returns `resetDemoData()`: clears all demo data (the user stays signed in) and
 * remounts the provider tree. Returns false if some keys couldn't be cleared.
 * Real backend: delete this, there is nothing local to reset.
 */
export const useResetDemoData = () => {
  const context = useContext(ResetContext);
  if (!context) {
    throw new Error('useResetDemoData must be used within AppProviders');
  }
  return context;
};

export default AppProviders;