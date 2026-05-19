import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLoginuserMutation } from "../../services/loginApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../store/authSlice";
import toast from "react-hot-toast";

function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loginFn, { isLoading }] = useLoginuserMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Please fill in all fields.");
      return;
    }
    try {
      const data = await loginFn(form).unwrap();
      dispatch(setCredentials({ token: data.token, role: data.role, id: data.id, name: data.name, email: data.email }));
      toast.success(`Welcome back, ${data.name || data.email}!`);
      navigate(data.role === "admin" ? "/admindash/dashboard" : "/studentdash/getallbooks");
    } catch (err) {
      if (err.status === "FETCH_ERROR") {
        toast.error("Unable to connect to the server. Please check if the backend is running.");
      } else {
        toast.error(err?.data?.message || "Invalid email or password.");
      }
    }
  };
  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-logo">
          <h1>📚 ReadOra</h1>
          <p>Your digital library companion</p>
        </div>
        <h2 className="auth-title">Welcome back</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-input" type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" name="password" placeholder="Enter your password" value={form.password} onChange={handleChange} required />
          </div>
          <button className="btn btn-primary btn-full" type="submit" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <p style={{ textAlign: "center", marginTop: 20, color: "var(--text-secondary)", fontSize: "0.9rem" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "var(--primary-light)", fontWeight: 600 }}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
