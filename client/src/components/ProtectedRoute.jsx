import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import LoadingScreen from './LoadingScreen';

/**
 * ProtectedRoute
 * - Shows LoadingScreen while auth is initializing
 * - Redirects to /login if not authenticated
 * - Renders children if authenticated
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuthStore();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
