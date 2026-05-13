import './App.css'
import { Outlet, useNavigate } from 'react-router-dom'
import Navbar from './components/addminnavbar';
import { useEffect } from 'react';
function App() {
    var naviagte=useNavigate();
    const token=window.localStorage.getItem("token")
    const role=window.localStorage.getItem("role")
    useEffect(()=>{
        if(token)
    {
        if(role=="student")
            return(<div>You are a student</div>)
        else
           naviagte("/admindash")
    }    
    else if(role){
        naviagte("/login")
    }
    },[])
    return (<Outlet></Outlet>)

}
export default App
