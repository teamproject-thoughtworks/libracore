import { useFormik } from "formik";
import "../App.css";
import { useLoginuserMutation } from "../services/loginApi";
import {Link, useNavigate} from "react-router-dom"
function Login() {
    var[addnewuserFn]=useLoginuserMutation();
    var naviagte=useNavigate();
    var login_details=useFormik({
        initialValues:{
            email:"",
            password:"",
            pin:""
        },
        onSubmit:()=>{
             addnewuserFn(login_details.values).then((res)=>{
                console.log(res)
                alert(res.data.msg)
                if(res.data.msg=="loginsuccess")
                {    
                   window.localStorage.setItem("token",res.data.token);
                   naviagte("/admindash")
                }   
             })

        }
    })
    return (
        <div className="container">
            <form className="form" onSubmit={login_details.handleSubmit}>
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Login</h2>
                <input type="email" placeholder="enter your mail" name="email" onChange={login_details.handleChange} className="input" required></input>
                <input type="password" placeholder="enter your password" name="password" onChange={login_details.handleChange} className="input" required></input>
                <input type="text" placeholder="enter your pin number" name="pin" onChange={login_details.handleChange} className="input" required></input><br></br>
                <button className="button" type="submit">Login</button>
                <p className="pstyle" >
                    Don't have an account? 
                    <Link to="/register">Sign Up</Link>
                </p>
            </form>
        </div>
    );
}

export default Login