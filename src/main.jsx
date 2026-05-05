import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Login from './loginform';
import Signup from './signupform.jsx';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './index.css'
import Addbook from './adminaddingbook.jsx';
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
        path: "/createbook",
        element: <Addbook />
      }
    ]
  },
]);

createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />
)