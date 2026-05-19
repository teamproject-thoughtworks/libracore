import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const RoleRoute = ({ allowedRole }) => {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role !== allowedRole) {
    return <Navigate to={role === "admin" ? "/admindash" : "/studentdash"} replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
