import { useEffect } from 'react';
import { Link, useParams } from 'react-router';
import { CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import OrderSummary from '../components/checkout/OrderSummary';
import NotFound from './NotFound';
import { useAuth } from '../context/AuthContext';
import { useCheckout } from '../context/CheckoutContext';
import { useOrders } from '../context/OrderContext';

/**
 * Reads the order from persisted orders by the :orderId in the URL, so it
 * survives refresh and can be bookmarked.
 */
const CheckoutConfirmation = () => {
  const { orderId } = useParams();
  const { isAuthenticated } = useAuth();
  const { getOrderById } = useOrders();
  const { resetCheckout } = useCheckout();

  // The order is safely stored, so the draft (address, card snapshot, guest flag) can go.
  useEffect(() => {
    resetCheckout();
  }, [resetCheckout]);

  const order = getOrderById(orderId);

  if (!order) {
    return (
      <NotFound
        title="Order Not Found"
        message="We couldn't find an order with that number."
        backTo="/shop"
        backLabel="Back to Shop"
      />
    );
  }

  const { shippingAddress: address, payment } = order;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
          <CheckCircle className="h-8 w-8 text-success" aria-hidden="true" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">Thank you for your order!</h1>
        <p className="mt-2 text-muted-foreground">
          Order <span className="font-semibold text-foreground">{order.id}</span> has been placed.
          {order.email && <> A confirmation would be sent to {order.email}.</>}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border p-5">
          <h2 className="mb-2 font-semibold text-foreground">Shipping to</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {address.fullName}<br />
            {address.line1}{address.line2 ? `, ${address.line2}` : ''}<br />
            {address.city}, {address.state} {address.zip}<br />
            {address.country}
          </p>
        </div>
        {payment && (
          <div className="rounded-lg border border-border p-5">
            <h2 className="mb-2 font-semibold text-foreground">Payment</h2>
            <p className="text-sm text-muted-foreground">{payment.brand} •••• {payment.last4}</p>
          </div>
        )}
      </div>

      <OrderSummary order={order} />

      {!isAuthenticated && (
        <p className="rounded-lg bg-secondary p-4 text-center text-sm text-muted-foreground">
          Want to track this order and save your details for next time?{' '}
          <Link to="/signup" className="font-semibold text-foreground underline underline-offset-2">
            Create an account
          </Link>
        </p>
      )}

      <div className="flex flex-wrap justify-center gap-3">
        {isAuthenticated && (
          <Button as={Link} to="/account/orders">View My Orders</Button>
        )}
        <Button as={Link} to="/shop" variant={isAuthenticated ? 'outline' : 'primary'}>
          Continue Shopping
        </Button>
      </div>
    </div>
  );
};

export default CheckoutConfirmation;