import { useGetDashboardStatsQuery } from "../../services/dashboardApi";

const StatCard = ({ icon, label, value, color }) => (
  <div className="stat-card">
    <div className="stat-icon">{icon}</div>
    <div className="stat-number" style={{ color }}>{value ?? "—"}</div>
    <div className="stat-label">{label}</div>
  </div>
);

const SkeletonCard = () => (
  <div className="stat-card">
    <div className="skeleton" style={{ height: 40, marginBottom: 8 }} />
    <div className="skeleton" style={{ height: 20, width: "60%", margin: "0 auto" }} />
  </div>
);

function DashboardPage() {
  const { data, isLoading, isError } = useGetDashboardStatsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  if (isError) return (
    <div className="empty-state">
      <div className="empty-icon">⚠️</div>
      <h3>Failed to load dashboard</h3>
      <p>Please check your connection and try again.</p>
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <h2>Admin Dashboard</h2>
        <p>Overview of your library system</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {isLoading ? (
          Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard icon="📚" label="Total Books" value={data?.stats.totalBooks} color="var(--primary-light)" />
            <StatCard icon="📖" label="Borrowed" value={data?.stats.totalBorrowed} color="var(--warning)" />
            <StatCard icon="✅" label="Available" value={data?.stats.totalAvailable} color="var(--success)" />
            <StatCard icon="⚠️" label="Overdue" value={data?.stats.totalOverdue} color="var(--danger)" />
            <StatCard icon="⏳" label="In Queue" value={data?.stats.totalQueue} color="var(--secondary)" />
            <StatCard icon="👥" label="Students" value={data?.stats.totalStudents} color="var(--primary-light)" />
          </>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Recent Borrows */}
        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: 16, color: "var(--text-primary)" }}>Recent Borrows</h3>
          {isLoading ? <div className="skeleton" style={{ height: 200 }} /> : (
            data?.recentBorrows?.length === 0 ? <p style={{ color: "var(--text-muted)" }}>No recent borrows.</p> :
            data?.recentBorrows?.map((b) => (
              <div key={b._id} className="borrow-info-row">
                <span className="borrow-info-label">{b.userId?.name || "Unknown"}</span>
                <span className="borrow-info-value">{b.bookId?.bookname || "Unknown"}</span>
              </div>
            ))
          )}
        </div>

        {/* Most Borrowed Books */}
        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: 16, color: "var(--text-primary)" }}>Most Borrowed</h3>
          {isLoading ? <div className="skeleton" style={{ height: 200 }} /> : (
            data?.mostBorrowed?.length === 0 ? <p style={{ color: "var(--text-muted)" }}>No data yet.</p> :
            data?.mostBorrowed?.map((b, i) => (
              <div key={i} className="borrow-info-row">
                <span className="borrow-info-label">{b.bookname}</span>
                <span className="borrow-info-value" style={{ color: "var(--primary-light)" }}>{b.count}x</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Overdue Books */}
      {!isLoading && data?.overdueList?.length > 0 && (
        <div className="card" style={{ marginTop: 24 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 16, color: "var(--danger)" }}>⚠️ Overdue Books</h3>
          <div className="borrow-grid">
            {data.overdueList.map((b) => (
              <div key={b._id} className="borrow-card">
                <div className="borrow-info-row"><span className="borrow-info-label">Student</span><span className="borrow-info-value">{b.userId?.name}</span></div>
                <div className="borrow-info-row"><span className="borrow-info-label">Book</span><span className="borrow-info-value">{b.bookId?.bookname}</span></div>
                <div className="borrow-info-row"><span className="borrow-info-label">Due Date</span><span className="borrow-info-value" style={{ color: "var(--danger)" }}>{new Date(b.returnDate).toLocaleDateString()}</span></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
