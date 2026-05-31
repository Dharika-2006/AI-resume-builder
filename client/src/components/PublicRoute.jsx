import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import LoadingScreen from './LoadingScreen';

/**
 * PublicRoute
 * - Shows LoadingScreen while auth is initializing
 * - Redirects authenticated users to /dashboard
 * - Renders children for unauthenticated users
 */
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuthStore();

  if (loading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
