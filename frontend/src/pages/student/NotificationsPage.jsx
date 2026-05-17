import { useGetNotificationQuery, useMarkAllReadMutation } from "../../services/notificationsApi";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";

const typeColors = {
  book_assigned: "var(--success)",
  borrow_overdue: "var(--danger)",
  extension_approved: "var(--secondary)",
  queue_updated: "var(--warning)",
  general: "var(--primary-light)",
};

const typeIcons = {
  book_assigned: "📗",
  borrow_overdue: "⚠️",
  extension_approved: "✅",
  queue_updated: "⏳",
  general: "🔔",
};

function NotificationsPage() {
  const { user } = useAuth();
  const { data, isLoading, refetch } = useGetNotificationQuery({ userId: user?.id }, { skip: !user?.id });
  const [markAll] = useMarkAllReadMutation();

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  const handleMarkAll = async () => {
    try {
      await markAll(user.id).unwrap();
      refetch();
      toast.success("All notifications marked as read.");
    } catch {
      toast.error("Failed to update notifications.");
    }
  };

  return (
    <div>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2>🔔 Notifications</h2>
          <p>{unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}</p>
        </div>
        {unreadCount > 0 && (
          <button className="btn btn-ghost btn-sm" onClick={handleMarkAll}>Mark all as read</button>
        )}
      </div>

      {isLoading ? (
        Array(4).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 80, marginBottom: 12, borderRadius: "var(--radius-md)" }} />)
      ) : notifications.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔕</div>
          <h3>No notifications yet</h3>
          <p>You'll see updates about your borrows and queue here.</p>
        </div>
      ) : (
        notifications.map((n) => (
          <div key={n._id} className={`notification-item ${!n.isRead ? "unread" : ""}`}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <span style={{ fontSize: "1.5rem" }}>{typeIcons[n.type] || "🔔"}</span>
              <div style={{ flex: 1 }}>
                <div className="notification-message">{n.message}</div>
                <div className="notification-time">{new Date(n.createdAt).toLocaleString()}</div>
              </div>
              {!n.isRead && (
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--primary-light)", flexShrink: 0, marginTop: 4 }} />
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default NotificationsPage;
