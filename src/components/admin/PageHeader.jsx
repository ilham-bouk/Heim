import { useEffect } from 'react';
import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { ADMIN_PAGE_TITLE_ID, focusAdminPageTitle } from '../../utils/admin';

/**
 * Title block for admin pages. Focuses the <h1> on mount so a route change is
 * announced (see utils/admin.js).
 *
 * @param {string} title
 * @param {string} [description]
 * @param {React.ReactNode} [actions] - right-aligned, e.g. an "Add" button
 * @param {string} [backTo] - shows a back link above the title
 * @param {string} [backLabel='Back']
 */
const PageHeader = ({ title, description, actions, backTo, backLabel = 'Back' }) => {
  useEffect(() => {
    focusAdminPageTitle();
  }, []);

  return (
    <div className="mb-8">
      {backTo && (
        <Link
          to={backTo}
          className="mb-4 inline-flex items-center gap-2 text-sm text-accent transition-colors hover:text-accent/80"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {backLabel}
        </Link>
      )}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1
            id={ADMIN_PAGE_TITLE_ID}
            tabIndex={-1}
            className="scroll-mt-28 text-2xl font-bold text-foreground focus:outline-none"
          >
            {title}
          </h1>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="shrink-0">{actions}</div>}
      </div>
    </div>
  );
};

export default PageHeader;