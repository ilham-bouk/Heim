import { createContext, useContext, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { useSeededCollection } from '../hooks/useSeededCollection';
import { getSeedOrders } from '../data/orderSeed';
import { applyStatusChange, buildOrder, canTransition, isActiveOrder } from '../services/orderService';
import { STORAGE_KEYS } from '../utils/storageKeys';
import { normalizeEmail } from '../utils/user';

const OrderContext = createContext();

const MOCK_LATENCY_MS = 800; // simulated network delay: remove when wiring a real API
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Orders live in ONE persisted collection, seeded once (data/orderSeed.js) like
 * the catalog. Checkout prepends new orders; the admin changes statuses.
 *
 * Views exposed:
 *  - orders / activeOrders: the SIGNED-IN customer's orders (matched by email).
 *    Real backend: GET /me/orders.
 *  - allOrders: every order, for the admin. Real backend: GET /admin/orders.
 *  - getOrderById: unscoped on purpose (guest confirmation pages). A real API must authorise it.
 *
 * Mutations are async (mock latency): placeOrder, updateOrderStatus.
 */
export const OrderProvider = ({ children }) => {
  const { user } = useAuth();
  const [allOrders, setAllOrders] = useSeededCollection(STORAGE_KEYS.orders, getSeedOrders);

  const email = user ? normalizeEmail(user.email) : null;

  const value = useMemo(() => {
    const orders = email ? allOrders.filter((order) => normalizeEmail(order.email ?? '') === email) : [];

    // Real backend: POST /orders. The server builds the order and returns it.
    const placeOrder = (details) => {
      const order = buildOrder(details, allOrders);

      return new Promise((resolve) => {
        setTimeout(() => {
          setAllOrders((prev) => [order, ...prev]);
          resolve(order);
        }, MOCK_LATENCY_MS);
      });
    };

    // Real backend: PATCH /orders/:id/status (the server enforces the transitions).
    const updateOrderStatus = async (id, nextStatus) => {
      const current = allOrders.find((order) => order.id === id);
      if (!current) throw new Error('This order no longer exists.');
      if (!canTransition(current, nextStatus)) {
        throw new Error(`A ${current.status.toLowerCase()} order can't be marked as ${nextStatus.toLowerCase()}.`);
      }

      await delay(MOCK_LATENCY_MS);
      setAllOrders((prev) => prev.map((order) => (order.id === id ? applyStatusChange(order, nextStatus) : order)));
    };

    return {
      orders,
      activeOrders: orders.filter(isActiveOrder),
      allOrders,
      getOrderById: (id) => allOrders.find((order) => order.id === id) || null,
      placeOrder,
      updateOrderStatus,
    };
  }, [allOrders, email, setAllOrders]);

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};