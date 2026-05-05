import { useFormik } from "formik";
import "./App.css";

function Signup() {
    let signup_details = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: "",
            role: "student" 
        },
        onSubmit: (values) => {
            console.log("Form Data:", values);
        }
    });

    return (
        <div className="container">
            <form className="form" onSubmit={signup_details.handleSubmit}>
                <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Sign Up</h2>
                <input className="input" type="text" placeholder="Full Name" name="name" onChange={signup_details.handleChange} />
                <input className="input" type="email" placeholder="Email" name="email" onChange={signup_details.handleChange} />
                <input className="input" type="password" placeholder="Password" name="password" onChange={signup_details.handleChange} />
                <div className="role-section">
                    <span className="role-label">Select Role:</span>
                    <div className="radio-group">
                        <label className="radio-option">
                            <input type="radio" name="role" value="student" checked={signup_details.values.role === "student"} onChange={signup_details.handleChange} />
                            Student
                        </label>
                        <label className="radio-option">
                            <input type="radio" name="role" value="admin" checked={signup_details.values.role === "admin"} onChange={signup_details.handleChange} />
                            Admin
                        </label>
                    </div>
                </div>
                <button className="button" type="submit">Sign Up</button>
                <p className="pstyle">
                    Already have an account? <span>Login</span>
                </p>
            </form>
        </div>
    );
}

export default Signup;