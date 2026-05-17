import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useSocket } from "../hooks/useSocket";
import toast from "react-hot-toast";
import { useEffect } from "react";

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, user } = useAuth();
  const socket = useSocket();

  const handleLogout = () => {
    signOut();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const isActive = (path) => location.pathname.includes(path);

  return (
    <div className="main-container">
      <nav className="navbar">
        <span className="nav-logo">📚 ReadOra</span>
        <div className="nav-links">
          <button className={`nav-btn ${isActive("dashboard") ? "active" : ""}`} onClick={() => navigate("/admindash/dashboard")}>Dashboard</button>
          <button className={`nav-btn ${isActive("getallbooks") ? "active" : ""}`} onClick={() => navigate("/admindash/getallbooks")}>Books</button>
          <button className={`nav-btn ${isActive("borrowbooks") ? "active" : ""}`} onClick={() => navigate("/admindash/borrowbooks")}>Borrowed</button>
          <button className={`nav-btn ${isActive("returnbooks") ? "active" : ""}`} onClick={() => navigate("/admindash/returnbooks")}>Returned</button>
          <button className="nav-btn nav-btn-add" onClick={() => navigate("/admindash/addbook")}>+ Add Book</button>
          <button className="nav-btn nav-logout" onClick={handleLogout}>Logout</button>
        </div>
      </nav>
      <div className="page-content">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
