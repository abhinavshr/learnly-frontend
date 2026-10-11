import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute() {
  const { token, isBootstrapping } = useSelector((state) => state.auth);
  const location = useLocation();

  // A token cookie exists but we haven't confirmed it with the backend yet —
  // wait rather than redirect, so a refresh on a protected page doesn't bounce
  // a logged-in user out to /login for a flash of a moment.
  if (isBootstrapping) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-ink-soft animate-spin" />
      </div>
    );
  }

  if (!token) {
    // Remember where they were headed so LoginPage can send them back after signing in
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}