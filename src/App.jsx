import './App.css'
import Login from './loginform'
import Signup from './signupform'
import Addbook from './adminaddingbook'
import { Outlet } from 'react-router-dom'
function App() {
    return (<Outlet></Outlet>)
}
export default App
