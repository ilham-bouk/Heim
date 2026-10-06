import { useState } from 'react';
import { NavLink, Outlet } from 'react-router';
import { ChevronDown, LayoutDashboard, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Breadcrumb from '../ui/Breadcrumb';
import { getInitials } from '../../utils/user';

// Each admin stage adds its entries here (and its <Route> in App.jsx).
const ADMIN_NAV = [
  {
    group: 'Overview',
    items: [{ name: 'Dashboard', href: '/admin', icon: LayoutDashboard, end: true }],
  },
];

const AdminLayout = () => {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Breadcrumb items={[{ label: 'Admin' }]} />

      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">

          {/* Sidebar. Below lg it collapses into a disclosure (no drawer, so no focus trap needed). */}
          <aside className="lg:col-span-1">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="admin-sidebar"
              className="flex w-full items-center justify-between rounded-xl bg-secondary px-4 py-3 text-sm font-semibold text-foreground lg:hidden"
            >
              <span className="flex items-center gap-2">
                <Menu className="h-4 w-4" aria-hidden="true" />
                Admin menu
              </span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${menuOpen ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </button>

            <div
              id="admin-sidebar"
              className={`mt-3 rounded-xl bg-secondary p-6 lg:sticky lg:top-24 lg:mt-0 lg:block ${menuOpen ? 'block' : 'hidden'}`}
            >
              <div className="mb-6 flex items-center gap-3 border-b border-border pb-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground">
                  {getInitials(user?.fullName)}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-foreground">{user?.fullName}</p>
                  <p className="text-sm text-muted-foreground">Administrator</p>
                </div>
              </div>

              <nav aria-label="Admin navigation" className="space-y-5">
                {ADMIN_NAV.map((section) => (
                  <div key={section.group}>
                    <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {section.group}
                    </p>
                    <div className="space-y-1">
                      {section.items.map((item) => (
                        <NavLink
                          key={item.name}
                          to={item.href}
                          end={item.end}
                          onClick={() => setMenuOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                              isActive
                                ? 'bg-primary text-primary-foreground'
                                : 'text-foreground/70 hover:bg-card hover:text-foreground'
                            }`
                          }
                        >
                          <item.icon className="h-4 w-4" aria-hidden="true" />
                          {item.name}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                ))}
              </nav>

              <p className="mt-6 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
                Demo mode: all data is stored in this browser only.
              </p>
            </div>
          </aside>

          <div className="lg:col-span-3">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;