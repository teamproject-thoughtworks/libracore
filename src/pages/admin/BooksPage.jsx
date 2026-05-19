import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllBooksQuery, useDeleteBookMutation } from "../../services/bookApi";
import { useBorrowbookMutation } from "../../services/borrowApi";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";

const BookSkeleton = () => (
  <div className="book-card">
    <div className="skeleton" style={{ height: 200 }} />
    <div style={{ padding: 16 }}>
      <div className="skeleton" style={{ height: 20, marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 16, width: "60%" }} />
    </div>
  </div>
);

function BooksPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const navigate = useNavigate();
  const { isAdmin, user } = useAuth();

  const { data, isLoading, refetch } = useGetAllBooksQuery({ search: debouncedSearch });
  const [deleteBook] = useDeleteBookMutation();
  const [borrowBook] = useBorrowbookMutation();

  // Debounce search input
  const handleSearch = useCallback((e) => {
    const val = e.target.value;
    setSearch(val);
    clearTimeout(window.__searchTimer);
    window.__searchTimer = setTimeout(() => setDebouncedSearch(val), 400);
  }, []);

  const handleDelete = async (bookname) => {
    if (!window.confirm(`Delete "${bookname}"?`)) return;
    try {
      await deleteBook(bookname).unwrap();
      toast.success("Book deleted.");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete book.");
    }
  };

  const handleBorrow = async (bookId) => {
    try {
      const res = await borrowBook({ bookId, userId: user.id }).unwrap();
      
      // Use message from backend, or fallback
      const msg = res?.message || (res?.data?.queued
        ? `Added to queue at position #${res.data.queuePosition}`
        : "Book borrowed successfully!");
        
      toast.success(msg);
      refetch(); // Ensure UI re-renders with new book quantities
    } catch (err) {
      toast.error(err?.data?.message || "Borrow failed.");
    }
  };

  const books = Array.isArray(data?.books) ? data.books : Array.isArray(data) ? data : [];

  return (
    <div>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2>{isAdmin ? "Manage Books" : "Browse Books"}</h2>
          <p>{books.length} book{books.length !== 1 ? "s" : ""} found</p>
        </div>
        <input className="search-bar" placeholder="🔍 Search by title, author, ISBN..." value={search} onChange={handleSearch} />
      </div>

      {isLoading ? (
        <div className="books-grid">{Array(6).fill(0).map((_, i) => <BookSkeleton key={i} />)}</div>
      ) : books.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No books found</h3>
          <p>{search ? "Try a different search term." : "No books in the library yet."}</p>
        </div>
      ) : (
        <div className="books-grid">
          {books.map((book) => (
            <div className="book-card" key={book._id}>
              {book.bookimg ? (
                <img className="book-cover" src={`http://localhost:3600/uploads/${book.bookimg}`} alt={book.bookname} />
              ) : (
                <div className="book-cover-placeholder">📖</div>
              )}
              <div className="book-info">
                <div className="book-title">{book.bookname}</div>
                <div className="book-author">by {book.author}</div>
                {book.category && <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: 8 }}>📂 {book.category}</div>}
                <span className={`book-badge ${book.quantity > 0 ? "badge-available" : "badge-unavailable"}`}>
                  {book.quantity > 0 ? `✓ ${book.quantity} available` : "✗ Unavailable"}
                </span>
              </div>
              <div className="book-actions">
                {isAdmin ? (
                  <>
                    <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/admindash/Updatebook/${book._id}`)}>✏️ Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(book.bookname)}>🗑️ Delete</button>
                  </>
                ) : (
                  <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => handleBorrow(book._id)}>
                    {book.quantity > 0 ? "📖 Borrow" : "⏳ Join Queue"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BooksPage;
