import { AuthProvider } from './AuthContext';
import { CartProvider } from './CartContext';
import { WishlistProvider } from './WishlistContext';
import { AddressProvider } from './AddressContext';
import { PaymentMethodProvider } from './PaymentMethodContext';
import { OrderProvider } from './OrderContext';
import { CheckoutProvider } from './CheckoutContext';

// Outermost first. ORDER MATTERS: a provider can only read providers listed
// above it. (Later stages add Settings, Catalog, Promos... above Cart/Auth.)
// Rendering inside <ToastProvider> and <BrowserRouter> is assumed.
const PROVIDERS = [
  AuthProvider,
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