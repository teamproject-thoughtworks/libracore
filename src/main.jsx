import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Login from './components/loginform.jsx';
import Signup from './components/signupform.jsx'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './index.css'
import Addbook from './features/adminaddingbook.jsx';
import { Provider } from 'react-redux';
import { store } from './app/store.js';
import Navbar from './components/addminnavbar.jsx';
import Getbook from "./features/getAllbooks.jsx"
import Updatebook from './features/updatebook.jsx';
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/register",
        element: <Signup />
      },
      {
        path: "/admindash",
        element: <Navbar />,
          children: [
          {
            path: "addbook",
            element: <Addbook />
          },
          {
            path:"getallbooks",
            element:<Getbook/>
          },
          {
            path:"Updatebook/:id",
            element:<Updatebook/>
          }
        ]
      }   
    ], 
  }
]);

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>  
)