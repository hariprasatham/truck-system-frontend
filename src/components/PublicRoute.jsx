import { Navigate, Outlet } from 'react-router-dom';
import useUserStore from '../store/userStore';

const PublicRoute = () => {
  const { isAuthenticated } = useUserStore();
  
  // If user is authenticated, redirect to dashboard
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  // Otherwise, render the child routes
  return <Outlet />;
};

export default PublicRoute;