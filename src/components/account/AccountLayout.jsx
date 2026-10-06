import { NavLink, Outlet } from 'react-router';
import { User, Package, Wallet, MapPin, Settings, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Breadcrumb from '../ui/Breadcrumb';
import { getInitials } from '../../utils/user';
import { ROLES } from '../../utils/constants';

const ACCOUNT_NAV = [
  { name: 'Profile', href: '/account/profile', icon: User },
  { name: 'Orders', href: '/account/orders', icon: Package },
  { name: 'Wallet', href: '/account/wallet', icon: Wallet },
  { name: 'Addresses', href: '/account/addresses', icon: MapPin },
  { name: 'Settings', href: '/account/settings', icon: Settings },
];

const ADMIN_LINK = { name: 'Admin', href: '/admin', icon: LayoutDashboard };

const AccountLayout = () => {
  const { user, hasRole } = useAuth();
  const navItems = hasRole(ROLES.ADMIN) ? [...ACCOUNT_NAV, ADMIN_LINK] : ACCOUNT_NAV;

  return (
    <div className="min-h-screen bg-white">
      <Breadcrumb items={[{ label: 'My Account' }]} />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-secondary rounded-xl p-6 lg:sticky lg:top-24">
              {/* User summary */}
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold shrink-0">
                  {getInitials(user?.fullName)}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground truncate">{user?.fullName}</p>
                  <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                </div>
              </div>

              {/* Nav */}
              <nav aria-label="Account navigation" className="space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-foreground/70 hover:text-foreground hover:bg-card'
                      }`
                    }
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </div>
          </aside>

          {/* Active tab content */}
          <div className="lg:col-span-3">
            <Outlet />
          </div>

        </div>
      </div>
    </div>
  );
};

export default AccountLayout;