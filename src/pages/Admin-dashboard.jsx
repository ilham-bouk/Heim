import { useMemo } from 'react';
import { Mail, MessageSquare, Receipt, Truck, Users, Wallet } from 'lucide-react';
import PageHeader from '../components/admin/PageHeader';
import StatCard from '../components/admin/StatCard';
import { useAuth } from '../context/AuthContext';
import { useMessages } from '../context/MessageContext';
import { useOrders } from '../context/OrderContext';
import { useSubscribers } from '../context/SubscriberContext';
import { DEMO_ADMIN } from '../config/demo';
import { deriveCustomers } from '../services/customerService';
import { KPI_WINDOW_DAYS, getOrderKpis } from '../services/dashboardService';

const money = (amount) => `$${amount.toLocaleString()}`;
const WINDOW_HINT = `Last ${KPI_WINDOW_DAYS} days`;
const DELTA_LABEL = `compared with the previous ${KPI_WINDOW_DAYS} days`;

/** /admin. Overview of the store. All numbers are derived from the contexts (see services/dashboardService.js). */
const AdminDashboard = () => {
  const { user } = useAuth();
  const { allOrders } = useOrders();
  const { messages, unreadCount } = useMessages();
  const { subscribers } = useSubscribers();

  const kpis = useMemo(() => getOrderKpis(allOrders), [allOrders]);

  // Real backend: GET /admin/customers. Same derivation and admin exclusion as /admin/customers.
  const customers = useMemo(() => deriveCustomers(allOrders, undefined, DEMO_ADMIN.email), [allOrders]);
  const customersWithOrders = useMemo(() => customers.filter((c) => c.orderCount > 0).length, [customers]);

  return (
    <div>
      <PageHeader title="Dashboard" description={`Welcome back, ${user?.fullName}.`} />

      <section aria-labelledby="dashboard-kpis-heading">
        <h2 id="dashboard-kpis-heading" className="sr-only">Key figures</h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          <StatCard
            label="Revenue"
            value={money(kpis.revenue.value)}
            icon={Wallet}
            to="/admin/orders"
            hint={WINDOW_HINT}
            delta={kpis.revenue.delta}
            deltaLabel={DELTA_LABEL}
          />
          <StatCard
            label="Orders"
            value={kpis.orders.value.toLocaleString()}
            icon={Receipt}
            to="/admin/orders"
            hint={WINDOW_HINT}
            delta={kpis.orders.delta}
            deltaLabel={DELTA_LABEL}
          />
          <StatCard
            label="In progress"
            value={kpis.inProgress.toLocaleString()}
            icon={Truck}
            to="/admin/orders"
            hint="Processing or shipped"
          />
          <StatCard
            label="Customers"
            value={customers.length.toLocaleString()}
            icon={Users}
            to="/admin/customers"
            hint={`${customersWithOrders} with orders`}
          />
          <StatCard
            label="Unread messages"
            value={unreadCount.toLocaleString()}
            icon={MessageSquare}
            to="/admin/messages?status=unread"
            hint={`of ${messages.length} total`}
          />
          <StatCard
            label="Subscribers"
            value={subscribers.length.toLocaleString()}
            icon={Mail}
            to="/admin/subscribers"
            hint="Newsletter"
          />
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;