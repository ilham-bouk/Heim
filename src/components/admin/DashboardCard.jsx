import { useId } from 'react';
import { Link } from 'react-router';

/**
 * Card shell for a dashboard section: an <h2>, an optional description and an
 * optional "view all" link, labelled together as one region.
 *
 * @param {string} title
 * @param {string} [description]
 * @param {{to: string, label: string}} [action] - link shown top right
 * @param {string} [className] - e.g. 'lg:col-span-2'
 */
const DashboardCard = ({ title, description, action, className = '', children }) => {
  const headingId = useId();

  return (
    <section aria-labelledby={headingId} className={`rounded-xl border border-border bg-card p-5 ${className}`}>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 id={headingId} className="text-lg font-bold text-foreground">{title}</h2>
          {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
        </div>
        {action && (
          <Link
            to={action.to}
            className="shrink-0 text-sm font-semibold text-accent-text transition-colors hover:text-foreground"
          >
            {action.label}
          </Link>
        )}
      </div>
      {children}
    </section>
  );
};

export default DashboardCard;