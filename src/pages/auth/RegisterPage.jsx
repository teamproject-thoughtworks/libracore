import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useRegisterUserMutation } from "../../services/signupApi";
import toast from "react-hot-toast";

function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [registerFn, { isLoading }] = useRegisterUserMutation();
  const navigate = useNavigate();

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error("All fields are required.");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    try {
      await registerFn({ name: form.name, email: form.email, password: form.password }).unwrap();
      toast.success("Registration successful! Please log in.");
      navigate("/login");
    } catch (err) {
      toast.error(err?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-logo">
          <h1>📚 ReadOra</h1>
          <p>Your digital library companion</p>
        </div>
        <h2 className="auth-title">Create account</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" type="text" name="name" placeholder="enter name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-input" type="email" name="email" placeholder="enter your email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" name="password" placeholder="password(6 characters)" value={form.password} onChange={handleChange} required />
          </div>
          <div style={{ background: "rgba(14, 165, 233, 0.1)", border: "1px solid rgba(14, 165, 233, 0.2)", borderRadius: "var(--radius-md)", padding: "12px 16px", marginBottom: 16, fontSize: "0.85rem", color: "var(--secondary)" }}>
            ℹ️ All accounts are registered as <strong>Student</strong>. Contact admin for admin access.
          </div>
          <button className="btn btn-primary btn-full" type="submit" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create Account"}
          </button>
        </form>
        <p style={{ textAlign: "center", marginTop: 20, color: "var(--text-secondary)", fontSize: "0.9rem" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--primary-light)", fontWeight: 600 }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
