import { Link, Navigate, useNavigate } from 'react-router';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useCheckout } from '../context/CheckoutContext';
import { getStepHref } from '../utils/checkoutSteps';

// Passed to /signin and /signup so they send the user back here afterwards
const RETURN_STATE = { from: { pathname: '/checkout' } };

const CheckoutAccount = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { cartItems } = useCart();
  const { updateDraft } = useCheckout();

  if (cartItems.length === 0) return <Navigate to="/cart" replace />;
  if (isAuthenticated) return <Navigate to={getStepHref('shipping')} replace />;

  const continueAsGuest = () => {
    updateDraft({ isGuest: true });
    navigate(getStepHref('shipping'));
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-foreground">How would you like to check out?</h1>
        <p className="mt-2 text-muted-foreground">
          Demo tip: no real account is needed — any valid email and an 8+ character password will work.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <section className="bg-card rounded-xl border border-border p-6 lg:p-8 flex flex-col">
          <h2 className="text-xl font-bold text-foreground mb-2">Sign in</h2>
          <p className="text-sm text-muted-foreground mb-6 flex-1">
            Use your saved addresses and payment methods, and track this order from your account.
          </p>
          <Button as={Link} to="/signin" state={RETURN_STATE} className="w-full">
            Sign In
          </Button>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            New to Heim?{' '}
            <Link
              to="/signup"
              state={RETURN_STATE}
              className="font-semibold text-foreground underline underline-offset-2 hover:text-muted-foreground transition-colors"
            >
              Create an account
            </Link>
          </p>
        </section>

        <section className="bg-card rounded-xl border border-border p-6 lg:p-8 flex flex-col">
          <h2 className="text-xl font-bold text-foreground mb-2">Guest checkout</h2>
          <p className="text-sm text-muted-foreground mb-6 flex-1">
            Check out without an account. The details you enter are used for this order only and aren't saved.
          </p>
          <Button variant="outline" className="w-full" onClick={continueAsGuest}>
            Continue as Guest
          </Button>
        </section>
      </div>
    </div>
  );
};

export default CheckoutAccount;