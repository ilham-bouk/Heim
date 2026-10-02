import { mockOrders } from '../data/mockData';
import { getFinalPrice } from '../utils/product';

// Order data helpers. Persistence/state lives in context/OrderContext.jsx.
// Real-backend seams: OrderContext.placeOrder → POST /orders,
// OrderContext `orders` → GET /me/orders. `buildOrder` disappears (server builds it).

/**
 * Order shape:
 * {
 *   id: string,                // e.g. 'HEIM-10231'
 *   date: string,               // ISO date string
 *   status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled',
 *   items: [
 *     { productId: number, name: string, image: string, price: number, quantity: number }
 *   ],
 *   subtotal: number,
 *   shipping: number,
 *   tax: number,
 *   discount?: number,
 *   total: number,
 *   shippingAddress: {
 *     fullName: string, line1: string, line2?: string, city: string, state: string, zip: string, country: string
 *   },
 *   payment?: { brand: string, last4: string },
 *   email?: string 
 * }
 */
export const getSeedOrders = () => mockOrders;

export const isActiveOrder = (order) => ['Processing', 'Shipped'].includes(order.status);

const ORDER_ID_PREFIX = 'HEIM-';
const ORDER_ID_FLOOR = 10000;

// Next sequential ID across every known order, e.g. HEIM-10232.
const getNextOrderId = (existingOrders) => {
  const highest = existingOrders.reduce(
    (max, order) => Math.max(max, parseInt(order.id.replace(ORDER_ID_PREFIX, ''), 10) || 0),
    ORDER_ID_FLOOR
  );
  return `${ORDER_ID_PREFIX}${highest + 1}`;
};

const toShippingAddress = ({ fullName, line1, line2, city, state, zip, country }) => ({
  fullName, line1, line2, city, state, zip, country,
});

/**
 * Builds an Order in the shape documented above from checkout data.
 * `items[].price` is the unit price actually charged (discount applied), so the
 * order doesn't change if the catalog changes later.
 */
export const buildOrder = ({ cartItems, totals, shippingAddress, payment, email }, existingOrders = []) => ({
  id: getNextOrderId(existingOrders),
  date: new Date().toISOString(),
  status: 'Processing',
  items: cartItems.map((item) => ({
    productId: item.id,
    name: item.name,
    image: item.image,
    price: getFinalPrice(item),
    quantity: item.quantity,
  })),
  subtotal: totals.subtotal,
  shipping: totals.shipping,
  tax: totals.tax,
  discount: totals.discount,
  total: totals.total,
  shippingAddress: toShippingAddress(shippingAddress),
  payment: { brand: payment.brand, last4: payment.last4 },
  email,
});