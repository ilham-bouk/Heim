import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';
import OrderSummary from '../components/checkout/OrderSummary';
import { useCart } from '../context/CartContext';
import { useCheckout } from '../context/CheckoutContext';
import { useOrders } from '../context/OrderContext';
import { CHECKOUT_BASE_PATH, getPreviousStepHref, getStepHref } from '../utils/checkoutSteps';

const ReviewSection = ({ title, editHref, children }) => (
  <div className="rounded-lg border border-border p-5">
    <div className="flex items-start justify-between gap-4 mb-2">
      <h2 className="font-semibold text-foreground">{title}</h2>
      <Link to={editHref} className="text-sm font-semibold text-accent hover:text-accent/80 transition-colors">
        Edit<span className="sr-only"> {title.toLowerCase()}</span>
      </Link>
    </div>
    <div className="text-sm text-muted-foreground leading-relaxed">{children}</div>
  </div>
);

const CheckoutReview = () => {
  const navigate = useNavigate();
  const { cartItems, subtotal, shipping, tax, discount, total, clearCart } = useCart();
  const { draft, isPlacingOrder, setIsPlacingOrder } = useCheckout();
  const { placeOrder } = useOrders();
  const [error, setError] = useState('');

  // The guard guarantees these exist before this page renders.
  const { shippingAddress: address, payment, email } = draft;

  const handlePlaceOrder = async () => {
    setError('');
    setIsPlacingOrder(true);

    try {
      const order = await placeOrder({
        cartItems,
        totals: { subtotal, shipping, tax, discount, total },
        shippingAddress: address,
        payment,
        email,
      });
      clearCart();
      navigate(`${CHECKOUT_BASE_PATH}/confirmation/${order.id}`, { replace: true });
    } catch {
      setIsPlacingOrder(false);
      setError('Something went wrong while placing your order. Please try again.');
    }
  };

  return (
    <section aria-labelledby="review-heading" className="space-y-6">
      <div>
        <h1 id="review-heading" className="text-2xl font-bold text-foreground">Review your order</h1>
        <p className="mt-1 text-sm text-muted-foreground">Check everything looks right before you place your order.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ReviewSection title="Shipping to" editHref={getStepHref('shipping')}>
          {address.fullName}<br />
          {address.line1}{address.line2 ? `, ${address.line2}` : ''}<br />
          {address.city}, {address.state} {address.zip}<br />
          {address.country}
        </ReviewSection>

        <ReviewSection title="Payment" editHref={getStepHref('payment')}>
          {payment.brand} •••• {payment.last4}<br />
          {payment.cardholderName}<br />
          Expires {payment.expMonth}/{payment.expYear}
        </ReviewSection>
      </div>

      <ReviewSection title="Contact" editHref={getStepHref('shipping')}>
        {email}
      </ReviewSection>

      <OrderSummary />

      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

      <p className="text-xs text-muted-foreground">
        Demo: placing an order doesn't charge anything — it's saved locally and shows up under Account → Orders.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to={getPreviousStepHref('review')}
          className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to payment
        </Link>
        <Button size="lg" onClick={handlePlaceOrder} disabled={isPlacingOrder}>
          {isPlacingOrder ? 'Placing order…' : `Place Order · $${total.toLocaleString()}`}
        </Button>
      </div>
    </section>
  );
};

export default CheckoutReview;