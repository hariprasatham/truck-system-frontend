import { Navigate, Outlet, useLocation } from "react-router-dom";
import useUserStore from '../store/userStore';
import { useEffect, useState } from 'react';
import Loader from './Loader';

/**
 * ProtectedRoute
 * Ensures only authenticated users can access protected pages.
 * 
 * - If user is logged in: renders child routes (<Outlet />)
 * - If not logged in: redirects to /login
 */
const ProtectedRoute = () => {
  const location = useLocation();
    const { isAuthenticated, loading } = useUserStore();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // ✅ Replace this with your actual authentication logic
  // e.g. check token, cookie, or global auth state (Redux/Context)
//   const isAuthenticated = Boolean(localStorage.getItem("authToken"));


  // Add a small delay to prevent flash of content
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCheckingAuth(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  if (loading || isCheckingAuth) {
    return <Loader />;
  }

  if (!isAuthenticated()) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }} // keep track of where user came from
      />
    );
  }

  // ✅ If authenticated, allow access to nested routes
  return <Outlet />;
};

export default ProtectedRoute;