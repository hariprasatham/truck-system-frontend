import { Navigate, Outlet, useLocation } from "react-router-dom";

/**
 * ProtectedRoute
 * Ensures only authenticated users can access protected pages.
 * 
 * - If user is logged in: renders child routes (<Outlet />)
 * - If not logged in: redirects to /login
 */
const ProtectedRoute = () => {
  const location = useLocation();

  // ✅ Replace this with your actual authentication logic
  // e.g. check token, cookie, or global auth state (Redux/Context)
//   const isAuthenticated = Boolean(localStorage.getItem("authToken"));
  const isAuthenticated = true;

  if (!isAuthenticated) {
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