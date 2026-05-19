import { useGetreturnbooksQuery } from "../../services/borrowApi";
import { useAuth } from "../../hooks/useAuth";

function ReturnedPage() {
  const { isAdmin, user } = useAuth();
  const queryArgs = isAdmin ? {} : { userId: user?.id };
  const { data, isLoading } = useGetreturnbooksQuery(queryArgs);

  const returns = Array.isArray(data?.borrows) ? data.borrows : Array.isArray(data) ? data : [];

  if (isLoading) return (
    <div className="borrow-grid">
      {Array(3).fill(0).map((_, i) => (
        <div key={i} className="borrow-card">
          {Array(3).fill(0).map((_, j) => <div key={j} className="skeleton" style={{ height: 20, marginBottom: 10 }} />)}
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <h2>{isAdmin ? "All Returned Books" : "My Return History"}</h2>
        <p>{returns.length} returned</p>
      </div>
      {returns.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No returns yet</h3>
        </div>
      ) : (
        <div className="borrow-grid">
          {returns.map((item) => (
            <div className="borrow-card" key={item._id}>
              <h3 style={{ color: "var(--success)", marginBottom: 16 }}>✅ Returned</h3>
              {isAdmin && item.userId && (
                <div className="borrow-info-row">
                  <span className="borrow-info-label">Student</span>
                  <span className="borrow-info-value">{item.userId.name || item.userId}</span>
                </div>
              )}
              <div className="borrow-info-row">
                <span className="borrow-info-label">Book</span>
                <span className="borrow-info-value">{item.bookId?.bookname || item.bookId}</span>
              </div>
              <div className="borrow-info-row">
                <span className="borrow-info-label">Borrowed</span>
                <span className="borrow-info-value">{new Date(item.borrowDate).toLocaleDateString()}</span>
              </div>
              <div className="borrow-info-row">
                <span className="borrow-info-label">Returned</span>
                <span className="borrow-info-value">{item.actualReturnDate ? new Date(item.actualReturnDate).toLocaleDateString() : "—"}</span>
              </div>
              {item.fine > 0 && (
                <div className="borrow-info-row">
                  <span className="borrow-info-label">Fine Paid</span>
                  <span className="borrow-info-value" style={{ color: "var(--warning)" }}>₹{item.fine}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReturnedPage;
