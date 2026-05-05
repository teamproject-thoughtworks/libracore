import { useFormik } from "formik";
import "./App.css";
function Login() {
    var login_details=useFormik({
        initialValues:{
            mail:"",
            password:"",
            pin:""
        },
        onSubmit:()=>{
            console.log("vachindi reyyyy")
        }
    })
    return (
        <div className="container">
            <form className="form" onSubmit={login_details.handleSubmit}>
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Login</h2>
                <input type="email" placeholder="enter your mail" name="mail" onChange={login_details.handleChange} className="input"></input>
                <input type="password" placeholder="enter your password" name="password" onChange={login_details.handleChange} className="input"></input>
                <input type="text" placeholder="enter your pin number" name="pin" onChange={login_details.handleChange} className="input"></input><br></br>
                <button className="button">Login</button>
                <p className="pstyle">
                    Don't have an account? <span>Sign Up</span>
                </p>
            </form>
        </div>
    );
}

export default Login