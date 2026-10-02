import { useCart } from '../../context/CartContext';
import { getFinalPrice } from '../../utils/product';

const money = (amount) => `$${amount.toLocaleString()}`;

const fromCart = ({ cartItems, subtotal, shipping, tax, discount, appliedPromo, total }) => ({
  items: cartItems.map((item) => ({
    id: item.id,
    name: item.name,
    image: item.image,
    price: getFinalPrice(item),
    quantity: item.quantity,
  })),
  totals: { subtotal, shipping, tax, discount, total },
  promoCode: appliedPromo?.code,
});

const fromOrder = (order) => ({
  items: order.items.map((item) => ({
    id: item.productId,
    name: item.name,
    image: item.image,
    price: item.price,
    quantity: item.quantity,
  })),
  totals: {
    subtotal: order.subtotal,
    shipping: order.shipping,
    tax: order.tax,
    discount: order.discount ?? 0,
    total: order.total,
  },
  promoCode: undefined,
});

const Row = ({ label, value }) => (
  <div className="flex justify-between text-sm">
    <dt className="text-muted-foreground">{label}</dt>
    <dd className="font-medium text-foreground">{value}</dd>
  </div>
);

/**
 * Read-only items + totals card.
 * @param {object} [order] - a placed Order to display; omit to show the live cart
 * @param {string} [className]
 */
const OrderSummary = ({ order, className = '' }) => {
  const cart = useCart();
  const { items, totals, promoCode } = order ? fromOrder(order) : fromCart(cart);

  return (
    <div className={`bg-secondary rounded-xl border border-border p-6 ${className}`}>
      <h2 className="text-lg font-bold text-foreground mb-4">Order Summary</h2>

      <ul className="divide-y divide-border">
        {items.map((item) => (
          <li key={item.id} className="flex gap-4 py-4 first:pt-0">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
              <img src={item.image} alt="" className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-foreground line-clamp-2">{item.name}</p>
              <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
            </div>
            <p className="font-semibold text-foreground">{money(item.price * item.quantity)}</p>
          </li>
        ))}
      </ul>

      <dl className="mt-2 space-y-2 border-t border-border pt-4">
        <Row label="Subtotal" value={money(totals.subtotal)} />
        <Row label="Shipping" value={totals.shipping === 0 ? 'FREE' : money(totals.shipping)} />
        <Row label="Tax" value={money(totals.tax)} />
        {totals.discount > 0 && (
          <Row
            label={promoCode ? `Promo (${promoCode})` : 'Discount'}
            value={`-${money(totals.discount)}`}
          />
        )}
        <div className="flex justify-between border-t border-border pt-4">
          <dt className="font-bold text-foreground">Total</dt>
          <dd className="text-xl font-bold text-accent">{money(totals.total)}</dd>
        </div>
      </dl>
    </div>
  );
};

export default OrderSummary;