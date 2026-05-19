import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";

function App() {
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && role) {
      navigate(role === "admin" ? "/admindash/dashboard" : "/studentdash/getallbooks", { replace: true });
    }
  }, []);

  return <Outlet />;
}

export default App;
