import { useFormik } from "formik";
import "../App.css";
import { useRegisterUserMutation } from "../services/signupApi";
import {Link, useNavigate} from "react-router-dom"
function Signup() {
    var [addnewusersignupdeatails]=useRegisterUserMutation();
    var navigate=useNavigate();
    let signup_details = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: "",
            role: "student" 
        },
        onSubmit: (values) => {
            console.log(signup_details.values)
            addnewusersignupdeatails(signup_details.values).then((res)=>{
                console.log(res)
                if((res.data) && (res.data.msg))
                {
                    alert("signup successfully")
                    window.localStorage.setItem("role",res.data.role)
                    navigate("/login")
                } 
                else{
                    alert("user already exists or server error")
                }  
            })
        }
    });

    return (
        <div className="container">
            <form className="form" onSubmit={signup_details.handleSubmit}>
                <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Sign Up</h2>
                <input className="input" type="text" placeholder="Full Name" name="name" onChange={signup_details.handleChange} required/>
                <input className="input" type="email" placeholder="Email" name="email" onChange={signup_details.handleChange} required/>
                <input className="input" type="password" placeholder="Password" name="password" onChange={signup_details.handleChange} required/>
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
                <p className="pstyle" >
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </form>
        </div>
    );
}

export default Signup;