import { useState } from 'react';
import { useLocation, useParams } from 'react-router';
import { CheckCircle, Receipt, Truck, X } from 'lucide-react';
import Button from '../components/ui/Button';
import ConfirmInline from '../components/ui/ConfirmInline';
import EmptyState from '../components/ui/EmptyState';
import StatusBadge from '../components/ui/StatusBadge';
import OrderSummary from '../components/checkout/OrderSummary';
import PageHeader from '../components/admin/PageHeader';
import { useOrders } from '../context/OrderContext';
import { useToast } from '../context/ToastContext';
import { ORDER_ACTION_LABELS, getNextStatuses, getStatusTone } from '../services/orderService';
import { formatDate, formatDateTime } from '../utils/format';
import { focusAdminPageTitle } from '../utils/admin';

const LIST_PATH = '/admin/orders';

// Icon per status an order can move INTO (labels live in orderService with the flow).
const ACTION_ICONS = { Shipped: Truck, Delivered: CheckCircle, Cancelled: X };

const InfoBlock = ({ title, children }) => (
  <div className="rounded-lg border border-border p-5">
    <h2 className="mb-2 font-semibold text-foreground">{title}</h2>
    <div className="text-sm leading-relaxed text-muted-foreground">{children}</div>
  </div>
);

/**
 * /admin/orders/:id. What an order can do next comes from ORDER_STATUS_CONFIG
 * (services/orderService.js); this page just renders those transitions.
 */
const AdminOrderDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const toast = useToast();
  const { getOrderById, updateOrderStatus } = useOrders();

  const [pendingStatus, setPendingStatus] = useState(null);
  const [confirmingCancel, setConfirmingCancel] = useState(false);

  const order = getOrderById(id);
  // Returns to the list with the filter/sort/page the admin came from.
  const listPath = `${LIST_PATH}${location.state?.fromSearch ?? ''}`;

  if (!order) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 lg:p-8">
        <PageHeader title="Order not found" backTo={listPath} backLabel="Back to orders" />
        <EmptyState
          icon={Receipt}
          title="This order doesn't exist"
          message="Check the order number, or go back to the list to pick another one."
        />
      </div>
    );
  }

  const nextStatuses = getNextStatuses(order);
  const showCancelConfirm = confirmingCancel && nextStatuses.includes('Cancelled');
  const history = order.statusHistory ?? [];
  const { shippingAddress: address, payment } = order;

  const handleStatusChange = async (nextStatus) => {
    setPendingStatus(nextStatus);
    try {
      await updateOrderStatus(order.id, nextStatus);
      toast.success(`Order ${order.id} is now ${nextStatus.toLowerCase()}.`);
      setConfirmingCancel(false);
      focusAdminPageTitle(); // the clicked button is replaced by the next action (or none)
    } catch (error) {
      toast.error(error.message || 'Could not update the order. Please try again.');
    } finally {
      setPendingStatus(null);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 lg:p-8">
      <PageHeader
        title={`Order ${order.id}`}
        description={`Placed on ${formatDate(order.date)} by ${order.email}`}
        backTo={listPath}
        backLabel="Back to orders"
      />

      <div className="space-y-6">
        <section aria-labelledby="order-status-heading" className="rounded-lg border border-border p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h2 id="order-status-heading" className="font-semibold text-foreground">Status</h2>
              <StatusBadge tone={getStatusTone(order.status)}>{order.status}</StatusBadge>
            </div>

            {nextStatuses.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {nextStatuses.map((next) => {
                  const Icon = ACTION_ICONS[next];
                  const isCancel = next === 'Cancelled';
                  return (
                    <Button
                      key={next}
                      size="sm"
                      variant={isCancel ? 'outline' : 'primary'}
                      className="gap-2 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={pendingStatus !== null}
                      aria-expanded={isCancel ? showCancelConfirm : undefined}
                      onClick={() => (isCancel ? setConfirmingCancel(true) : handleStatusChange(next))}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      {pendingStatus === next && !isCancel ? 'Updating…' : ORDER_ACTION_LABELS[next]}
                    </Button>
                  );
                })}
              </div>
            )}
          </div>

          {nextStatuses.length === 0 && (
            <p className="mt-3 text-sm text-muted-foreground">
              {order.status} is a final status, so there are no further actions.
            </p>
          )}

          {/* The Cancel trigger stays mounted so ConfirmInline can return focus to it. */}
          {showCancelConfirm && (
            <div className="mt-4 border-t border-border pt-4">
              <ConfirmInline
                message={`Cancel order ${order.id}? The customer will see it as cancelled and it can't be reopened.`}
                confirmLabel="Yes, cancel order"
                busyLabel="Cancelling…"
                busy={pendingStatus === 'Cancelled'}
                onConfirm={() => handleStatusChange('Cancelled')}
                onCancel={() => setConfirmingCancel(false)}
              />
            </div>
          )}
        </section>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <InfoBlock title="Customer">{order.email}</InfoBlock>
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

export default AdminOrderDetail;