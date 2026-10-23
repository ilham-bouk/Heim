import { useMemo } from 'react';
import { Mail, MessageSquare, Receipt, Truck, Users, Wallet } from 'lucide-react';
import BarList from '../components/admin/BarList';
import ColumnChart from '../components/admin/ColumnChart';
import DashboardCard from '../components/admin/DashboardCard';
import PageHeader from '../components/admin/PageHeader';
import StatCard from '../components/admin/StatCard';
import { useAuth } from '../context/AuthContext';
import { useMessages } from '../context/MessageContext';
import { useOrders } from '../context/OrderContext';
import { useSubscribers } from '../context/SubscriberContext';
import { DEMO_ADMIN } from '../config/demo';
import { deriveCustomers } from '../services/customerService';
import {
  KPI_WINDOW_DAYS,
  REVENUE_MONTHS,
  TOP_PRODUCTS_LIMIT,
  getCategorySales,
  getMonthlyRevenue,
  getOrderKpis,
  getStatusBreakdown,
  getTopProducts,
} from '../services/dashboardService';

const money = (amount) => `$${amount.toLocaleString()}`;
const WINDOW_HINT = `Last ${KPI_WINDOW_DAYS} days`;
const DELTA_LABEL = `compared with the previous ${KPI_WINDOW_DAYS} days`;

// Full class names on purpose: Tailwind only generates classes it can see in source.
const STATUS_BAR_CLASS = {
  neutral: 'bg-muted-foreground',
  accent: 'bg-accent',
  success: 'bg-success',
  danger: 'bg-destructive',
};

const EmptyNote = ({ children }) => (
  <p className="py-8 text-center text-sm text-muted-foreground">{children}</p>
);

/** /admin. Overview of the store. All numbers are derived from the contexts (see services/dashboardService.js). */
const AdminDashboard = () => {
  const { user } = useAuth();
  const { allOrders } = useOrders();
  const { messages, unreadCount } = useMessages();
  const { subscribers } = useSubscribers();

  const kpis = useMemo(() => getOrderKpis(allOrders), [allOrders]);
  const monthly = useMemo(() => getMonthlyRevenue(allOrders), [allOrders]);
  const statuses = useMemo(() => getStatusBreakdown(allOrders), [allOrders]);
  const categorySales = useMemo(() => getCategorySales(allOrders), [allOrders]);
  const topProducts = useMemo(() => getTopProducts(allOrders), [allOrders]);

  // Real backend: GET /admin/customers. Same derivation and admin exclusion as /admin/customers.
  const customers = useMemo(() => deriveCustomers(allOrders, undefined, DEMO_ADMIN.email), [allOrders]);
  const customersWithOrders = useMemo(() => customers.filter((c) => c.orderCount > 0).length, [customers]);

  const hasMonthlyRevenue = monthly.some((month) => month.value > 0);

  return (
    <div className="space-y-6">
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
            hint={`${WINDOW_HINT}, excl. cancelled`}
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DashboardCard
          title="Monthly revenue"
          description={`Last ${REVENUE_MONTHS} months, excluding cancelled orders. The current month is incomplete.`}
          className="lg:col-span-2"
        >
          {hasMonthlyRevenue ? (
            <ColumnChart
              data={monthly}
              ariaLabel={`Monthly revenue for the last ${REVENUE_MONTHS} months. The values are listed in the table that follows.`}
              caption="Revenue per month, excluding cancelled orders"
              labelHeader="Month"
              valueHeader="Revenue"
              formatValue={money}
            />
          ) : (
            <EmptyNote>Revenue appears here once orders are placed.</EmptyNote>
          )}
        </DashboardCard>

        <DashboardCard title="Orders by status" description="All orders, including cancelled.">
          {allOrders.length > 0 ? (
            <BarList
              items={statuses.map(({ status, tone, count }) => ({
                key: status,
                label: status,
                value: count,
                barClass: STATUS_BAR_CLASS[tone],
              }))}
              ariaLabel="Number of orders in each status. The values are listed in the table that follows."
              caption="Orders per status"
              labelHeader="Status"
              valueHeader="Orders"
            />
          ) : (
            <EmptyNote>No orders yet.</EmptyNote>
          )}
        </DashboardCard>

        <DashboardCard
          title="Sales by category"
          description="Item value, excluding tax, shipping and cancelled orders."
        >
          {categorySales.length > 0 ? (
            <BarList
              items={categorySales.map(({ category, value }) => ({ key: category, label: category, value }))}
              ariaLabel="Item value sold in each category. The values are listed in the table that follows."
              caption="Item value per category, excluding cancelled orders"
              labelHeader="Category"
              valueHeader="Item value"
              formatValue={money}
            />
          ) : (
            <EmptyNote>Category sales appear here once orders are placed.</EmptyNote>
          )}
        </DashboardCard>

        <DashboardCard
          title="Top products"
          description={`Top ${TOP_PRODUCTS_LIMIT} by units sold, excluding cancelled orders.`}
          className="lg:col-span-2"
        >
          {topProducts.length > 0 ? (
            <BarList
              items={topProducts.map(({ productId, name, units, revenue }) => ({
                key: String(productId),
                label: name,
                value: units,
                display: `${units} sold`,
                secondary: money(revenue),
              }))}
              ariaLabel={`The top ${TOP_PRODUCTS_LIMIT} products by units sold. The values are listed in the table that follows.`}
              caption="Units sold and revenue per product, excluding cancelled orders"
              labelHeader="Product"
              valueHeader="Units sold"
              secondaryHeader="Revenue"
            />
          ) : (
            <EmptyNote>Best sellers appear here once orders are placed.</EmptyNote>
          )}
        </DashboardCard>
      </div>
    </div>
  );
};

export default AdminDashboard;