import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAddbookMutation, useUpdateBookMutation } from "../../services/bookApi";
import toast from "react-hot-toast";

function BookForm({ mode = "add" }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = mode === "edit";

  const [form, setForm] = useState({ bookname: "", author: "", quantity: "", details: "", category: "", ISBN: "", language: "English", publishedYear: "", publisher: "", shelfLocation: "" });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [addBook, { isLoading: isAdding }] = useAddbookMutation();
  const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation();
  const isLoading = isAdding || isUpdating;

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.bookname || !form.author || !form.quantity) {
      toast.error("Book name, author, and quantity are required.");
      return;
    }
    if (!isEdit && !image) {
      toast.error("Please select a cover image.");
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => { if (v) formData.append(k, v); });
    if (image) formData.append("bookimg", image);

    try {
      if (isEdit) {
        await updateBook({ id, formData }).unwrap();
        toast.success("Book updated successfully!");
      } else {
        await addBook(formData).unwrap();
        toast.success("Book added successfully!");
      }
      navigate("/admindash/getallbooks");
    } catch (err) {
      toast.error(err?.data?.message || `Failed to ${isEdit ? "update" : "add"} book.`);
    }
  };

  return (
    <div className="form-container">
      <h2>{isEdit ? "✏️ Update Book" : "➕ Add New Book"}</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Image preview */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          {preview ? (
            <img src={preview} alt="preview" style={{ width: 120, height: 160, objectFit: "cover", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }} />
          ) : (
            <div style={{ width: 120, height: 160, borderRadius: "var(--radius-md)", border: "2px dashed var(--border)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "2rem" }}>📷</div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Cover Image {!isEdit && <span style={{ color: "var(--danger)" }}>*</span>}</label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="form-input" style={{ cursor: "pointer" }} />
        </div>

        {[
          { name: "bookname", label: "Book Name *", placeholder: "e.g. The Great Gatsby" },
          { name: "author", label: "Author *", placeholder: "e.g. F. Scott Fitzgerald" },
          { name: "ISBN", label: "ISBN", placeholder: "e.g. 978-3-16-148410-0" },
          { name: "category", label: "Category", placeholder: "e.g. Fiction, Science, History" },
          { name: "publisher", label: "Publisher", placeholder: "e.g. Penguin Books" },
          { name: "shelfLocation", label: "Shelf Location", placeholder: "e.g. A-12" },
        ].map(({ name, label, placeholder }) => (
          <div className="form-group" key={name}>
            <label className="form-label">{label}</label>
            <input className="form-input" type="text" name={name} placeholder={placeholder} value={form[name]} onChange={handleChange} />
          </div>
        ))}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Quantity *</label>
            <input className="form-input" type="number" name="quantity" placeholder="0" min="0" value={form.quantity} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Published Year</label>
            <input className="form-input" type="number" name="publishedYear" placeholder="2024" value={form.publishedYear} onChange={handleChange} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Language</label>
          <input className="form-input" type="text" name="language" value={form.language} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-input form-textarea" name="details" placeholder="Brief description of the book..." value={form.details} onChange={handleChange} />
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={() => navigate("/admindash/getallbooks")}>Cancel</button>
          <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={isLoading}>
            {isLoading ? "Saving..." : isEdit ? "Update Book" : "Add Book"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default BookForm;
