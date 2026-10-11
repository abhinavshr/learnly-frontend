import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { Loader2 } from "lucide-react";

export default function GuestRoute() {
  const { isAuthenticated, isBootstrapping } = useSelector((state) => state.auth);

  if (isBootstrapping) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-ink-soft animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}