import { Navigate, Outlet } from "react-router";
import { useAppSelector } from "../../store/store";
import Loader from "./Loader";

export default function PublicOnlyRoute() {
  const { isAuthenticated, user, isLoading, token } = useAppSelector((state) => state.auth);

  if (isLoading || (token && !user)) {
    return <Loader />;
  }

  if (isAuthenticated && user) {
    if (user.role === "doctor") return <Navigate to="/doctor/dashboard" replace />;
    if (user.role === "admin") return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/patient/dashboard" replace />;
  }

  return <Outlet />;
}
