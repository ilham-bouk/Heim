import { useMemo } from 'react';
import { Link } from 'react-router';
import { Receipt, Users } from 'lucide-react';
import DataTable from '../components/admin/DataTable';
import PageHeader from '../components/admin/PageHeader';
import { useOrders } from '../context/OrderContext';
import { DEMO_ADMIN } from '../config/demo';
import { deriveCustomers } from '../services/customerService';
import { formatDate } from '../utils/format';

const iconButtonClass =
  'inline-flex h-9 w-9 items-center justify-center rounded-lg text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground';

// Module-level so DataTable's memoised filtering/sorting stays stable.
const getCustomerId = (customer) => customer.id;
const getSearchText = (customer) => `${customer.fullName} ${customer.email} ${customer.location}`;

const COLUMNS = [
  {
    key: 'fullName',
    header: 'Customer',
    sortable: true,
    render: (customer) => (
      <div className="min-w-48">
        <p className="font-medium text-foreground">{customer.fullName}</p>
        <p className="text-xs">{customer.email}</p>
      </div>
    ),
  },
  {
    key: 'location',
    header: 'Location',
    sortable: true,
    render: (customer) => customer.location || '—',
  },
  { key: 'orderCount', header: 'Orders', sortable: true, align: 'right' },
  {
    key: 'totalSpent',
    header: 'Total spent',
    sortable: true,
    align: 'right',
    render: (customer) => (
      <span className="font-medium text-foreground">${customer.totalSpent.toLocaleString()}</span>
    ),
  },
  {
    key: 'lastOrderAt',
    header: 'Last order',
    sortable: true,
    sortValue: (customer) => customer.lastOrderAt ?? '', // no orders sorts last when newest-first
    render: (customer) =>
      customer.lastOrderAt ? <span className="whitespace-nowrap">{formatDate(customer.lastOrderAt)}</span> : '—',
  },
];

/**
 * /admin/customers. Read-only directory derived from orders + the seed pool
 * (see services/customerService.js for how, and its limits).
 */
const AdminCustomers = () => {
  const { allOrders } = useOrders();

  // Real backend: GET /admin/customers. The admin is excluded by role there;
  // here the demo admin's email stands in for that.
  const customers = useMemo(() => deriveCustomers(allOrders, undefined, DEMO_ADMIN.email), [allOrders]);
  const withOrders = useMemo(() => customers.filter((c) => c.orderCount > 0).length, [customers]);

  return (
    <div className="rounded-xl border border-border bg-card p-6 lg:p-8">
      <PageHeader
        title="Customers"
        description={`${customers.length} customers, ${withOrders} with orders. Built from order emails.`}
      />

      <DataTable
        caption="Customers"
        columns={COLUMNS}
        rows={customers}
        getRowId={getCustomerId}
        searchText={getSearchText}
        searchLabel="Search customers"
        initialSort={{ key: 'lastOrderAt', direction: 'desc' }}
        syncToUrl
        rowActions={(customer) => (
          <div className="flex items-center justify-end">
            {customer.orderCount > 0 && (
              <Link
                to={`/admin/orders?q=${encodeURIComponent(customer.email)}`}
                aria-label={`View orders from ${customer.fullName}`}
                className={iconButtonClass}
              >
                <Receipt className="h-4 w-4" aria-hidden="true" />
              </Link>
            )}
          </div>
        )}
        emptyIcon={Users}
        emptyTitle="No customers yet"
        emptyMessage="Customers appear here once they place an order."
      />
    </div>
  );
};

export default AdminCustomers;