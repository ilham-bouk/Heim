import { AuthProvider } from './AuthContext';
import { CatalogProvider } from './CatalogContext';
import { BlogProvider } from './BlogContext';
import { SettingsProvider } from './SettingsContext';
import { PromoProvider } from './PromoContext';
import { CartProvider } from './CartContext';
import { WishlistProvider } from './WishlistContext';
import { AddressProvider } from './AddressContext';
import { PaymentMethodProvider } from './PaymentMethodContext';
import { OrderProvider } from './OrderContext';
import { CheckoutProvider } from './CheckoutContext';

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
  CartProvider,
  WishlistProvider,
  AddressProvider,
  PaymentMethodProvider,
  OrderProvider,
  CheckoutProvider,
];

const AppProviders = ({ children }) =>
  PROVIDERS.reduceRight((tree, Provider) => <Provider>{tree}</Provider>, children);

export default AppProviders;