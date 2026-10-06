import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import NotAuthorized from './NotAuthorized';

/**
 * Route guard for pages that require a signed-in user, optionally with a role.
 *
 * Not authenticated -> redirect to /signin, passing the attempted
 * destination via router state so SignIn can send the user back after
 * they log in (see SignIn.jsx's use of location.state.from).
 * Authenticated but wrong role -> render <NotAuthorized/> in place (no redirect).
 *
 * @param {string} [requiredRole] - e.g. ROLES.ADMIN. Omit for "any signed-in user".
*/
const ProtectedRoute = ({ requiredRole }) => {
  const { isAuthenticated, hasRole } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return <NotAuthorized />;
  }

  return <Outlet />;
};

export default ProtectedRoute;