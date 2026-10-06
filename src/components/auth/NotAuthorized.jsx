import { Link } from 'react-router';
import { ShieldAlert } from 'lucide-react';
import Button from '../ui/Button';

/**
 * Shown in place of a page when the user is signed in but lacks the required
 * role. Props mirror pages/NotFound.jsx.
 */
const NotAuthorized = ({
  title = "You're not authorised to view this page",
  message = 'This area is only available to administrators. If you think this is a mistake, sign in with an admin account.',
  backTo = '/account',
  backLabel = 'Back to my account',
}) => (
  <div className="flex min-h-screen items-center justify-center bg-white px-4 py-20">
    <div role="alert" className="w-full max-w-md text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
        <ShieldAlert className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
      </div>
      <h1 className="mb-3 text-3xl font-bold text-foreground">{title}</h1>
      <p className="mx-auto mb-8 max-w-sm leading-relaxed text-muted-foreground">{message}</p>
      <Button as={Link} to={backTo} size="lg">
        {backLabel}
      </Button>
    </div>
  </div>
);

export default NotAuthorized;