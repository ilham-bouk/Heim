import { Package } from 'lucide-react';
import { useOrders } from '../context/OrderContext';

const STATUS_STYLES = {
  Delivered: 'bg-success/10 text-success',
  Shipped: 'bg-accent/10 text-accent',
  Processing: 'bg-secondary text-muted-foreground',
  Cancelled: 'bg-destructive/10 text-destructive',
};

const AccountOrders = () => {
  const { orders } = useOrders();

  if (orders.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border p-6 lg:p-8 text-center py-16">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
            <Package className="w-8 h-8 text-muted-foreground" />
          </div>
        </div>
        <h1 className="text-xl font-bold text-foreground mb-2">No orders yet</h1>
        <p className="text-muted-foreground max-w-sm mx-auto">
          When you place an order, it'll show up here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-foreground mb-1">Order History</h1>
      <p className="text-sm text-muted-foreground mb-8">
        {orders.length} order{orders.length !== 1 ? 's' : ''} placed
      </p>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border border-border rounded-lg p-5">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <div>
                <p className="font-semibold text-foreground">{order.id}</p>
                <p className="text-sm text-muted-foreground">
                  Placed on{' '}
                  {new Date(order.date).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  STATUS_STYLES[order.status] || STATUS_STYLES.Processing
                }`}
              >
                {order.status}
              </span>
            </div>

            {/* Item thumbnails */}
            <div className="flex items-center gap-2 mb-4">
              {order.items.map((item) => (
                <img
                  key={item.productId}
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 rounded-md object-cover border border-border"
                />
              ))}
              <span className="text-sm text-muted-foreground ml-1">
                {order.items.length} item{order.items.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="pt-4 border-t border-border">
              <span className="font-semibold text-foreground">
                Total: ${order.total.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountOrders;