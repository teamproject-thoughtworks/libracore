import { useGetborrowbooksQuery, useReturnBookMutation } from "../../services/borrowApi";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";

const BorrowSkeleton = () => (
  <div className="borrow-card">
    {Array(4).fill(0).map((_, i) => (
      <div key={i} className="skeleton" style={{ height: 20, marginBottom: 10 }} />
    ))}
  </div>
);

function BorrowCard({ item, onReturn, isAdmin }) {
  const isOverdue = new Date(item.returnDate) < new Date() && item.status === "borrowed";

  return (
    <div className="borrow-card">
      <h3 style={{ color: isOverdue ? "var(--danger)" : "var(--primary-light)" }}>
        {isOverdue ? "⚠️ Overdue" : "📖 Active Borrow"}
      </h3>
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
        <span className="borrow-info-label">Borrow Date</span>
        <span className="borrow-info-value">{new Date(item.borrowDate).toLocaleDateString()}</span>
      </div>
      <div className="borrow-info-row">
        <span className="borrow-info-label">Due Date</span>
        <span className="borrow-info-value" style={{ color: isOverdue ? "var(--danger)" : "var(--text-primary)" }}>
          {new Date(item.returnDate).toLocaleDateString()}
        </span>
      </div>
      <div className="borrow-info-row">
        <span className="borrow-info-label">Status</span>
        <span className={`book-badge badge-${item.status}`}>{item.status}</span>
      </div>
      {item.fine > 0 && (
        <div className="borrow-info-row">
          <span className="borrow-info-label">Fine</span>
          <span className="borrow-info-value" style={{ color: "var(--danger)" }}>₹{item.fine}</span>
        </div>
      )}
      {isAdmin && (
        <button className="btn btn-success btn-sm" style={{ marginTop: 16, width: "100%" }} onClick={() => onReturn(item._id)}>
          ✅ Return Book
        </button>
      )}
    </div>
  );
}

function BorrowedPage() {
  const { isAdmin, user } = useAuth();
  const queryArgs = isAdmin ? {} : { userId: user?.id };
  const { data, isLoading } = useGetborrowbooksQuery(queryArgs);
  const [returnBook] = useReturnBookMutation();

  const borrows = Array.isArray(data?.borrows) ? data.borrows : Array.isArray(data) ? data : [];

  const handleReturn = async (borrowId) => {
    try {
      await returnBook(borrowId).unwrap();
      toast.success("Book returned successfully!");
    } catch (err) {
      toast.error(err?.data?.message || "Return failed.");
    }
  };

  if (isLoading) return <div className="borrow-grid">{Array(3).fill(0).map((_, i) => <BorrowSkeleton key={i} />)}</div>;

  return (
    <div>
      <div className="page-header">
        <h2>{isAdmin ? "All Borrowed Books" : "My Borrowed Books"}</h2>
        <p>{borrows.length} active borrow{borrows.length !== 1 ? "s" : ""}</p>
      </div>
      {borrows.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No borrowed books</h3>
          <p>Nothing is currently borrowed.</p>
        </div>
      ) : (
        <div className="borrow-grid">
          {borrows.map((item) => (
            <BorrowCard key={item._id} item={item} onReturn={handleReturn} isAdmin={isAdmin} />
          ))}
        </div>
      )}
    </div>
  );
}

export default BorrowedPage;
