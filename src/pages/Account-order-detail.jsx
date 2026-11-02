import { Link, useParams } from 'react-router';
import { ArrowLeft, Package } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';
import StatusBadge from '../components/ui/StatusBadge';
import OrderSummary from '../components/checkout/OrderSummary';
import { useOrders } from '../context/OrderContext';
import { getStatusTone } from '../services/orderService';
import { formatDate, formatDateTime } from '../utils/format';

const LIST_PATH = '/account/orders';

const InfoBlock = ({ title, children }) => (
  <div className="rounded-lg border border-border p-5">
    <h2 className="mb-2 font-semibold text-foreground">{title}</h2>
    <div className="text-sm leading-relaxed text-muted-foreground">{children}</div>
  </div>
);

const BackLink = () => (
  <Link
    to={LIST_PATH}
    className="mb-6 inline-flex items-center gap-2 text-sm text-accent-text transition-colors hover:text-foreground"
  >
    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
    Back to orders
  </Link>
);

/**
 * /account/orders/:id. Uses `orders` (the signed-in customer's own orders), NOT getOrderById,
 * so a customer can't open someone else's order by guessing an id.
 * Real backend: GET /me/orders/:id.
 */
const AccountOrderDetail = () => {
  const { id } = useParams();
  const { orders } = useOrders();
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="bg-card rounded-xl border border-border p-6 lg:p-8">
        <BackLink />
        <h1 className="sr-only">Order not found</h1>
        <EmptyState
          icon={Package}
          title="We couldn't find that order"
          message="It may belong to another account. Go back to your orders to pick one."
        />
      </div>
    );
  }

  const { shippingAddress: address, payment } = order;
  const history = order.statusHistory ?? [];

  return (
    <div className="bg-card rounded-xl border border-border p-6 lg:p-8">
      <BackLink />

      <div className="mb-8 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Order {order.id}</h1>
          <p className="text-sm text-muted-foreground">Placed on {formatDate(order.date)}</p>
        </div>
        <StatusBadge tone={getStatusTone(order.status)}>{order.status}</StatusBadge>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InfoBlock title="Shipping to">
            {address.fullName}<br />
            {address.line1}{address.line2 ? `, ${address.line2}` : ''}<br />
            {address.city}, {address.state} {address.zip}<br />
            {address.country}
          </InfoBlock>
          <InfoBlock title="Payment">
            {payment ? `${payment.brand} •••• ${payment.last4}` : 'Not recorded'}
          </InfoBlock>
        </div>

        <OrderSummary order={order} />

        {history.length > 0 && (
          <section aria-labelledby="order-history-heading" className="rounded-lg border border-border p-5">
            <h2 id="order-history-heading" className="mb-4 font-semibold text-foreground">History</h2>
            <ol className="space-y-3">
              {history.map((entry) => (
                <li key={`${entry.status}-${entry.at}`} className="flex flex-wrap items-center justify-between gap-3 text-sm">
                  <StatusBadge tone={getStatusTone(entry.status)}>{entry.status}</StatusBadge>
                  <time dateTime={entry.at} className="text-muted-foreground">{formatDateTime(entry.at)}</time>
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>
    </div>
  );
};

export default AccountOrderDetail;