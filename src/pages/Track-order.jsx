import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import Button from '../components/ui/Button';
import FormField from '../components/forms/FormField';
import InfoPage from '../components/ui/InfoPage';
import StatusBadge from '../components/ui/StatusBadge';
import { useOrders } from '../context/OrderContext';
import { getStatusTone, matchesTrackingEmail } from '../services/orderService';
import { formatDate, formatDateTime } from '../utils/format';
import { isValidEmail } from '../utils/validators';

const NOT_FOUND = "We couldn't find an order with that number and email. Check both and try again.";

/**
 * Guest-friendly order lookup: order number AND email must match.
 * Every failure gives the same message, so it can't be used to find out which orders exist.
 *
 * Real backend: POST /orders/track { orderId, email }. getOrderById is unscoped on purpose
 * (see services/orderService.js), so the SERVER must check the email, rate-limit this
 * endpoint and return only what is shown here (never the address or payment).
 */
const TrackOrder = () => {
  const { getOrderById } = useOrders();
  const formRef = useRef(null);
  const resultRef = useRef(null);

  const [values, setValues] = useState({ orderId: '', email: '' });
  const [errors, setErrors] = useState({});
  const [submitCount, setSubmitCount] = useState(0);
  const [order, setOrder] = useState(null);
  const [notFound, setNotFound] = useState(false);

  // After a failed submit, move focus to the first invalid field.
  useEffect(() => {
    if (submitCount === 0) return;
    formRef.current?.querySelector('[aria-invalid="true"]')?.focus();
  }, [submitCount]);

  // After a successful lookup, move focus to the result.
  useEffect(() => {
    if (order) resultRef.current?.focus();
  }, [order]);

  const setField = (name) => (e) => {
    const { value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: '' } : prev));
    setNotFound(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nextErrors = {};
    if (!values.orderId.trim()) nextErrors.orderId = 'Order number is required';
    if (!values.email.trim()) nextErrors.email = 'Email is required';
    else if (!isValidEmail(values.email.trim())) nextErrors.email = 'Please enter a valid email address';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setSubmitCount((count) => count + 1);
      return;
    }

    const found = getOrderById(values.orderId.trim().toUpperCase());
    if (found && matchesTrackingEmail(found, values.email)) {
      setOrder(found);
      setNotFound(false);
    } else {
      setOrder(null);
      setNotFound(true);
    }
  };

  const history = order?.statusHistory ?? [];

  return (
    <InfoPage
      eyebrow="Order status"
      title="Track Your Order"
      intro="Enter your order number and the email you used at checkout."
    >
      <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-5 rounded-xl border border-border bg-card p-6 lg:p-8">
        <FormField label="Order number" required error={errors.orderId} hint="For example HEIM-10101. It's in your confirmation.">
          {(control) => (
            <input name="orderId" type="text" autoComplete="off" value={values.orderId} onChange={setField('orderId')} {...control} />
          )}
        </FormField>
        <FormField label="Email" required error={errors.email}>
          {(control) => (
            <input name="email" type="email" autoComplete="email" value={values.email} onChange={setField('email')} {...control} />
          )}
        </FormField>

        {notFound && (
          <p role="alert" className="text-sm font-semibold text-destructive-text">{NOT_FOUND}</p>
        )}

        <Button type="submit">Track order</Button>
      </form>

      {order && (
        <section
          ref={resultRef}
          tabIndex={-1}
          aria-labelledby="track-result-heading"
          className="mt-8 rounded-xl border border-border bg-card p-6 focus:outline-none lg:p-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="track-result-heading" className="text-xl font-bold text-foreground">Order {order.id}</h2>
            <StatusBadge tone={getStatusTone(order.status)}>{order.status}</StatusBadge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Placed on {formatDate(order.date)}</p>

          <h3 className="mb-2 mt-6 font-semibold text-foreground">Items</h3>
          <ul className="space-y-1 text-sm text-foreground/80">
            {order.items.map((item) => (
              <li key={item.productId}>{item.quantity} × {item.name}</li>
            ))}
          </ul>

          {history.length > 0 && (
            <>
              <h3 className="mb-3 mt-6 font-semibold text-foreground">History</h3>
              <ol className="space-y-3">
                {history.map((entry) => (
                  <li key={`${entry.status}-${entry.at}`} className="flex flex-wrap items-center justify-between gap-3 text-sm">
                    <StatusBadge tone={getStatusTone(entry.status)}>{entry.status}</StatusBadge>
                    <time dateTime={entry.at} className="text-muted-foreground">{formatDateTime(entry.at)}</time>
                  </li>
                ))}
              </ol>
            </>
          )}
        </section>
      )}

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Have an account?{' '}
        <Link to="/account/orders" className="font-semibold text-accent-text underline underline-offset-2 hover:text-foreground">
          See all your orders
        </Link>
      </p>
    </InfoPage>
  );
};

export default TrackOrder;