import { Link } from 'react-router';
import { User, Mail, Phone, Cake, Truck, Pencil } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';

const STATUS_MESSAGE = {
  Processing: 'is being prepared',
  Shipped: 'is on its way',
};

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 py-4 border-b border-border last:border-0">
    <Icon className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
    <div>
      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-foreground font-medium">
        {value || <span className="text-muted-foreground font-normal">Not added yet</span>}
      </p>
    </div>
  </div>
);

const formatBirthday = (value) => {
  if (!value) return '';
  return new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
};

const AccountProfile = () => {
  const { user } = useAuth();
  const { activeOrders } = useOrders();

  return (
    <div className="space-y-6">

      {/* Active order banner(s) — only rendered when something is
          actually in flight. */}
      {activeOrders.map((order) => (
        <div
          key={order.id}
          className="flex flex-wrap items-center gap-4 rounded-xl border border-accent/30 bg-accent/5 p-5"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent/10 shrink-0">
            <Truck className="w-5 h-5 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground">
              Order {order.id} {STATUS_MESSAGE[order.status] || 'is in progress'}
            </p>
            <p className="text-sm text-muted-foreground">
              Placed on {new Date(order.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })} · ${order.total.toLocaleString()}
            </p>
          </div>
          <Link
            to="/account/orders"
            className="text-sm font-semibold text-accent hover:text-accent/80 transition-colors shrink-0"
          >
            Track Order
          </Link>
        </div>
      ))}

      {/* Read-only info card */}
      <div className="bg-card rounded-xl border border-border p-6 lg:p-8">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">Profile Information</h1>
            <p className="text-sm text-muted-foreground">
              Your account details. Head to Settings to make changes.
            </p>
          </div>
          <Link
            to="/account/settings"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent/80 transition-colors shrink-0"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit
          </Link>
        </div>

        <div className="mt-4">
          <InfoRow icon={User} label="Full name" value={user?.fullName} />
          <InfoRow icon={Mail} label="Email address" value={user?.email} />
          <InfoRow icon={Phone} label="Phone number" value={user?.phone} />
          <InfoRow icon={Cake} label="Birthday" value={formatBirthday(user?.birthday)} />
        </div>
      </div>
    </div>
  );
};

export default AccountProfile;