import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { Suspense, lazy } from "react";
import { Toaster } from "react-hot-toast";
import { store } from "./store/index.js";
import "./styles/globals.css";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import RoleRoute from "./routes/RoleRoute.jsx";

// Lazy-loaded pages
const LoginPage = lazy(() => import("./pages/auth/LoginPage.jsx"));
const RegisterPage = lazy(() => import("./pages/auth/RegisterPage.jsx"));
const AdminLayout = lazy(() => import("./layouts/AdminLayout.jsx"));
const StudentLayout = lazy(() => import("./layouts/StudentLayout.jsx"));
const DashboardPage = lazy(() => import("./pages/admin/DashboardPage.jsx"));
const BooksPage = lazy(() => import("./pages/admin/BooksPage.jsx"));
const BorrowedPage = lazy(() => import("./pages/admin/BorrowedPage.jsx"));
const ReturnedPage = lazy(() => import("./pages/admin/ReturnedPage.jsx"));
const NotificationsPage = lazy(() => import("./pages/student/NotificationsPage.jsx"));
const BookForm = lazy(() => import("./components/books/BookForm.jsx"));

const Loading = () => (
  <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-base)" }}>
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "3rem", marginBottom: 16 }}>📚</div>
      <p style={{ color: "var(--text-secondary)" }}>Loading ReadOra...</p>
    </div>
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <Suspense fallback={<Loading />}><LoginPage /></Suspense>,
  },
  {
    path: "/register",
    element: <Suspense fallback={<Loading />}><RegisterPage /></Suspense>,
  },

  // Admin routes (protected + role)
  {
    element: <ProtectedRoute />,
    children: [{
      element: <RoleRoute allowedRole="admin" />,
      children: [{
        path: "/admindash",
        element: <Suspense fallback={<Loading />}><AdminLayout /></Suspense>,
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: "dashboard", element: <Suspense fallback={<Loading />}><DashboardPage /></Suspense> },
          { path: "getallbooks", element: <Suspense fallback={<Loading />}><BooksPage /></Suspense> },
          { path: "addbook", element: <Suspense fallback={<Loading />}><BookForm mode="add" /></Suspense> },
          { path: "Updatebook/:id", element: <Suspense fallback={<Loading />}><BookForm mode="edit" /></Suspense> },
          { path: "borrowbooks", element: <Suspense fallback={<Loading />}><BorrowedPage /></Suspense> },
          { path: "returnbooks", element: <Suspense fallback={<Loading />}><ReturnedPage /></Suspense> },
        ],
      }],
    }],
  },

  // Student routes (protected + role)
  {
    element: <ProtectedRoute />,
    children: [{
      element: <RoleRoute allowedRole="student" />,
      children: [{
        path: "/studentdash",
        element: <Suspense fallback={<Loading />}><StudentLayout /></Suspense>,
        children: [
          { index: true, element: <Navigate to="getallbooks" replace /> },
          { path: "getallbooks", element: <Suspense fallback={<Loading />}><BooksPage /></Suspense> },
          { path: "borrowbooks", element: <Suspense fallback={<Loading />}><BorrowedPage /></Suspense> },
          { path: "returnbooks", element: <Suspense fallback={<Loading />}><ReturnedPage /></Suspense> },
          { path: "notifications", element: <Suspense fallback={<Loading />}><NotificationsPage /></Suspense> },
        ],
      }],
    }],
  },

  // Catch-all
  { path: "*", element: <Navigate to="/login" replace /> },
]);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: "var(--bg-card)",
          color: "var(--text-primary)",
          border: "1px solid var(--border)",
          fontFamily: "var(--font)",
        },
        success: { iconTheme: { primary: "#22c55e", secondary: "#fff" } },
        error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
      }}
    />
  </Provider>
);