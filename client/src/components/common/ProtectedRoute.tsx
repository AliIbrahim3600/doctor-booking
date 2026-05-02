import { Navigate, Outlet } from "react-router";
import { useAppSelector } from "../../store/store";
import Loader from "./Loader";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading, token } = useAppSelector((state) => state.auth);

  if (isLoading || (token && !user)) {
    return <Loader />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    if (user.role === "doctor") return <Navigate to="/doctor/dashboard" replace />;
    if (user.role === "admin") return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/patient/dashboard" replace />;
  }

  return <Outlet />;
}
