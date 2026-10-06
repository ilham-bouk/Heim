import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

// TEMP: replaced by the real dashboard in Stage 8. The toast
// preview below exists so the toast system can be tested now; remove it then.
const AdminDashboard = () => {
  const { user } = useAuth();
  const toast = useToast();

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-6 lg:p-8">
        <h1 className="mb-1 text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back, {user?.fullName}. Stats and charts arrive in a later stage.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 lg:p-8">
        <h2 className="mb-4 text-xl font-bold text-foreground">Toast preview</h2>
        <div className="flex flex-wrap gap-3">
          <Button size="sm" onClick={() => toast.success('Product saved.')}>Success</Button>
          <Button size="sm" variant="outline" onClick={() => toast.info('Heads up: this is a demo.')}>Info</Button>
          <Button size="sm" variant="danger" onClick={() => toast.error('Something went wrong. Please try again.')}>Error</Button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;