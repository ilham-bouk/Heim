import { useMemo } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router';
import { Eye, Receipt } from 'lucide-react';
import StatusBadge from '../components/ui/StatusBadge';
import DataTable from '../components/admin/DataTable';
import PageHeader from '../components/admin/PageHeader';
import { useOrders } from '../context/OrderContext';
import { ORDER_STATUSES, getStatusTone, isActiveOrder } from '../services/orderService';
import { formatDate } from '../utils/format';

const iconButtonClass =
  'inline-flex h-9 w-9 items-center justify-center rounded-lg text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground';

// Module-level so DataTable's memoised filtering/sorting stays stable.
const getOrderId = (order) => order.id;
const getSearchText = (order) =>
  `${order.id} ${order.email} ${order.shippingAddress.fullName} ${order.status}`;
const countItems = (order) => order.items.reduce((sum, item) => sum + item.quantity, 0);

const COLUMNS = [
  {
    key: 'id',
    header: 'Order',
    sortable: true,
    render: (order) => (
      <div className="min-w-40">
        <p className="font-medium text-foreground">{order.id}</p>
        <p className="text-xs">{order.email}</p>
      </div>
    ),
  },
  {
    key: 'shipTo',
    header: 'Ship to',
    render: (order) => (
      <div className="min-w-36">
        <p className="text-foreground">{order.shippingAddress.fullName}</p>
        <p className="text-xs">
          {order.shippingAddress.city}, {order.shippingAddress.state}
        </p>
      </div>
    ),
  },
  {
    key: 'date',
    header: 'Date',
    sortable: true,
    render: (order) => <span className="whitespace-nowrap">{formatDate(order.date)}</span>,
  },
  { key: 'items', header: 'Items', sortable: true, align: 'right', sortValue: countItems, render: countItems },
  {
    key: 'total',
    header: 'Total',
    sortable: true,
    align: 'right',
    render: (order) => <span className="font-medium text-foreground">${order.total.toLocaleString()}</span>,
  },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    render: (order) => <StatusBadge tone={getStatusTone(order.status)}>{order.status}</StatusBadge>,
  },
];

const AdminOrders = () => {
  const { allOrders } = useOrders();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // The status filter lives in the URL (?status=Shipped) next to DataTable's own q/sort/page.
  const statusParam = searchParams.get('status');
  const status = ORDER_STATUSES.includes(statusParam) ? statusParam : '';

  const statusCounts = useMemo(
    () =>
      Object.fromEntries(
        ORDER_STATUSES.map((s) => [s, allOrders.filter((order) => order.status === s).length])
      ),
    [allOrders]
  );
  const inProgress = useMemo(() => allOrders.filter(isActiveOrder).length, [allOrders]);

  const rows = useMemo(
    () => (status ? allOrders.filter((order) => order.status === status) : allOrders),
    [allOrders, status]
  );

  const handleStatusChange = (e) => {
    const { value } = e.target;
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set('status', value);
        else next.delete('status');
        next.delete('page'); // a different filter means a different page count
        return next;
      },
      { replace: true }
    );
  };

  const statusFilter = (
    <div>
      <label htmlFor="order-status-filter" className="sr-only">Filter by status</label>
      <select
        id="order-status-filter"
        value={status}
        onChange={handleStatusChange}
        className="rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="">All statuses ({allOrders.length})</option>
        {ORDER_STATUSES.map((s) => (
          <option key={s} value={s}>{s} ({statusCounts[s]})</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="rounded-xl border border-border bg-card p-6 lg:p-8">
      <PageHeader title="Orders" description={`${allOrders.length} orders, ${inProgress} in progress.`} />

      <DataTable
        caption="Orders"
        columns={COLUMNS}
        rows={rows}
        getRowId={getOrderId}
        searchText={getSearchText}
        searchLabel="Search orders"
        toolbar={statusFilter}
        initialSort={{ key: 'date', direction: 'desc' }}
        syncToUrl
        rowActions={(order) => (
          <div className="flex items-center justify-end">
            {/* fromSearch lets the detail page's back link restore this filter/sort/page. */}
            <Link
              to={`/admin/orders/${order.id}`}
              state={{ fromSearch: location.search }}
              aria-label={`View order ${order.id}`}
              className={iconButtonClass}
            >
              <Eye className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        )}
        emptyIcon={Receipt}
        emptyTitle={status ? `No ${status.toLowerCase()} orders` : 'No orders yet'}
        emptyMessage={status ? 'Try another status.' : 'Orders placed at checkout show up here.'}
      />
    </div>
  );
};

export default AdminOrders;