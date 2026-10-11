import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute() {
  const { isAuthenticated, isBootstrapping } = useSelector((state) => state.auth);
  const location = useLocation();

  if (isBootstrapping) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-ink-soft animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}