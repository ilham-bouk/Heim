import { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { buildOrder, getSeedOrders, isActiveOrder } from '../services/orderService';
import { STORAGE_KEYS } from '../utils/storageKeys';

const OrderContext = createContext();

const ORDERS_STORAGE_KEY = STORAGE_KEYS.orders;
const MOCK_LATENCY_MS = 800; // simulated network delay — remove when wiring a real API

// Orders placed through Checkout are persisted to localStorage and merged in
// front of the seed orders from mockData. To drop the demo seeds, make
// `orders` return only `placedOrders`.
//
// Real backend: `placeOrder` → POST /orders, `orders` → GET /me/orders.

export const OrderProvider = ({ children }) => {
  const [placedOrders, setPlacedOrders] = useLocalStorage(ORDERS_STORAGE_KEY, []);

  const orders = [...placedOrders, ...getSeedOrders()];

  const placeOrder = (details) => {
    const order = buildOrder(details, orders);

    return new Promise((resolve) => {
      setTimeout(() => {
        setPlacedOrders((prev) => [order, ...prev]);
        resolve(order);
      }, MOCK_LATENCY_MS);
    });
  };

  const getOrderById = (id) => orders.find((order) => order.id === id) || null;

  const value = {
    orders,
    activeOrders: orders.filter(isActiveOrder),
    getOrderById,
    placeOrder,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};