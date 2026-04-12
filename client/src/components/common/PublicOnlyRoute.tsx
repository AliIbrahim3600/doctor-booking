import { Navigate, Outlet } from "react-router";
import { useAppSelector } from "../../store/store";

export default function PublicOnlyRoute() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  if (isAuthenticated && user) {
    if (user.role === "doctor") return <Navigate to="/doctor/dashboard" replace />;
    if (user.role === "admin") return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/patient/dashboard" replace />;
  }

  return <Outlet />;
}
