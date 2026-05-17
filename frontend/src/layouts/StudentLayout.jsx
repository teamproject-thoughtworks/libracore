import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useSocket } from "../hooks/useSocket";
import { useGetNotificationQuery } from "../services/notificationsApi";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function StudentLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, user } = useAuth();
  const socket = useSocket();
  const [unread, setUnread] = useState(0);

  const { data: notifData } = useGetNotificationQuery(
    { userId: user?.id },
    { skip: !user?.id }
  );

  useEffect(() => {
    if (notifData?.unreadCount !== undefined) setUnread(notifData.unreadCount);
  }, [notifData]);

  // Real-time notification listener
  useEffect(() => {
    if (!socket) return;
    const handleNewNotification = (notif) => {
      setUnread((prev) => prev + 1);
      toast.success(notif.message, { duration: 5000, icon: "🔔" });
    };
    socket.on("notification_created", handleNewNotification);
    return () => socket.off("notification_created", handleNewNotification);
  }, [socket]);

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
          <button className={`nav-btn ${isActive("getallbooks") ? "active" : ""}`} onClick={() => navigate("/studentdash/getallbooks")}>Browse Books</button>
          <button className={`nav-btn ${isActive("borrowbooks") ? "active" : ""}`} onClick={() => navigate("/studentdash/borrowbooks")}>My Borrows</button>
          <button className={`nav-btn ${isActive("returnbooks") ? "active" : ""}`} onClick={() => navigate("/studentdash/returnbooks")}>Returned</button>
          <button
            className={`nav-btn ${isActive("notifications") ? "active" : ""}`}
            onClick={() => { navigate("/studentdash/notifications"); setUnread(0); }}
            style={{ position: "relative" }}
          >
            🔔 Notifications
            {unread > 0 && (
              <span style={{ position: "absolute", top: 4, right: 4, background: "#ef4444", color: "white", borderRadius: "50%", width: 18, height: 18, fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </button>
          <button className="nav-btn nav-logout" onClick={handleLogout}>Logout</button>
        </div>
      </nav>
      <div className="page-content">
        <Outlet />
      </div>
    </div>
  );
}

export default StudentLayout;
