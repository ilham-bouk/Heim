import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../../context/AuthContext';

/**
 * Route guard for pages that require a signed-in user.
 *
 * Not authenticated -> redirect to /signin, passing the attempted
 * destination via router state so SignIn can send the user back after
 * they log in (see SignIn.jsx's use of location.state.from).
 */
const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;