import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Loader2 } from 'lucide-react';
interface ProtectedRouteProps {
  children?: React.ReactNode;
}
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Get authentication status and loading state from AuthContext
  const { isAuthenticated, isLoading } = useAuth();
  // Get the current route/location
  // This is used to remember which protected page the user tried to access
  const location = useLocation();
  // While authentication status is being checked,
  // display a loading screen instead of redirecting prematurely
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300">
        <div className="relative mb-4">
          {/* Security icon indicating that the session is being verified */}
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center animate-pulse">
            <ShieldCheck className="w-8 h-8 text-indigo-400" />
          </div>
          {/* Animated spinner indicating an ongoing authentication check */}
          <Loader2 className="w-6 h-6 text-indigo-400 animate-spin absolute -bottom-1 -right-1" />
        </div>
        <p className="text-sm font-medium text-slate-400 tracking-wide">
          Verifying InspectDB Session...
        </p>
      </div>
    );
  }
  // If the user is not authenticated,
  // redirect them to the login page
  if (!isAuthenticated) {
    // Preserve the page the user originally tried to access.
    // After successful login, this location can be used to redirect
    // the user back to the requested protected page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  // If authenticated:
  // - Render the provided children when using nested JSX
  // - Otherwise render the nested route using <Outlet />
  return children ? <>{children}</> : <Outlet />;
};
