import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useCheckout } from '../../context/CheckoutContext';
import { CHECKOUT_BASE_PATH, getStepRedirect } from '../../utils/checkoutSteps';

/**
 * Layout-route guard for the sequential checkout steps. In order, it:
 *  1. stands down while an order is being placed (the cart is about to be emptied),
 *  2. sends an empty cart back to /cart,
 *  3. requires sign-in OR the guest flag (else → /checkout/account),
 *  4. blocks skipping ahead: a step is only reachable once every earlier step's
 *     `isComplete` passes (see utils/checkoutSteps.js).
 */
const CheckoutGuard = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { cartItems } = useCart();
  const { draft, isPlacingOrder, setIsPlacingOrder } = useCheckout();

  // The guard unmounts when we navigate to the confirmation page; re-arm it then.
  useEffect(() => () => setIsPlacingOrder(false), [setIsPlacingOrder]);

  if (isPlacingOrder) return <Outlet />;

  if (cartItems.length === 0) return <Navigate to="/cart" replace />;

  if (!isAuthenticated && !draft.isGuest) {
    return <Navigate to={`${CHECKOUT_BASE_PATH}/account`} replace />;
  }

  const redirect = getStepRedirect(location.pathname, draft);
  if (redirect) return <Navigate to={redirect} replace />;

  return <Outlet />;
};

export default CheckoutGuard;