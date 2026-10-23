import { Link } from 'react-router';

/**
 * Compact list of links for dashboard "recent activity" cards.
 * Each row is one link; status is passed as `badge` so it is always text.
 *
 * @param {Array<{key: string, to: string, title: string, subtitle: string, emphasis?: boolean, badge?: React.ReactNode}>} items
 */
const RecentList = ({ items }) => (
  <ul className="divide-y divide-border">
    {items.map((item) => (
      <li key={item.key}>
        <Link
          to={item.to}
          className="-mx-2 flex items-center justify-between gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <span className="min-w-0">
            <span className={`block truncate text-sm text-foreground ${item.emphasis ? 'font-bold' : 'font-medium'}`}>
              {item.title}
            </span>
            <span className="block truncate text-xs text-muted-foreground">{item.subtitle}</span>
          </span>
          {item.badge && <span className="shrink-0">{item.badge}</span>}
        </Link>
      </li>
    ))}
  </ul>
);

export default RecentList;