import { Outlet, useNavigate } from "react-router-dom";
import "../adminnavbar.css";

function Navbar() {
  const navigate = useNavigate();

  return (
    <div className="main-container">

      <div className="navbar">

        <div className="logo-section">
          <h2>ReadOra</h2>
        </div>

        <div className="search-section">
          <input type="text" placeholder="Search books..." />
        </div>

        <div className="menu-section">

          <button
            onClick={() => navigate("/admindash/getallbooks")}
          >
            Get All Books
          </button>

          <button
            onClick={() => navigate("/admindash/borrowbooks")}
          >
            Borrow Books
          </button>

          <button
            onClick={() => navigate("/admindash/returnbooks")}
          >
            Return Books
          </button>

          <button
            className="add-btn"
            onClick={() => navigate("/admindash/addbook")}
          >
            + Add Book
          </button>

        </div>
      </div>

      <div className="outlet-container">
        <Outlet />
      </div>

    </div>
  );
}

export default Navbar;