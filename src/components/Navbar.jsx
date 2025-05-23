import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/FirebaseServices";

const Navbar = ({ user, userRole, darkMode, toggleDarkMode }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav
      className={`navbar navbar-expand-lg ${
        darkMode ? "navbar-dark bg-dark" : "navbar-dark bg-primary"
      } shadow sticky-top`}
    >
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          🎪 Eventsphere
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/events">
                <i className="bi bi-calendar-event me-1"></i> Events
              </Link>
            </li>
            {userRole === "organizer" && (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-person-badge me-1"></i> Organizer
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li>
                    <Link className="dropdown-item" to="/admin/dashboard">
                      <i className="bi bi-speedometer2 me-2"></i> Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/admin/events/create">
                      <i className="bi bi-plus-circle me-2"></i> Create Event
                    </Link>
                  </li>
                </ul>
              </li>
            )}
          </ul>
          <div className="d-flex align-items-center">
            {/* Dark Mode Toggle */}
            <button
              className="btn btn-link text-light me-3 p-0"
              onClick={toggleDarkMode}
              aria-label={
                darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
              }
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? (
                <i className="bi bi-sun-fill fs-5"></i>
              ) : (
                <i className="bi bi-moon-fill fs-5"></i>
              )}
            </button>

            {/* User Authentication */}
            {user ? (
              <div className="d-flex align-items-center">
                <div className="text-light me-3 d-none d-md-block">
                  <i className="bi bi-person-circle me-1"></i>
                  {user.displayName || user.email}
                </div>
                <div className="dropdown">
                  <button
                    className="btn btn-outline-light dropdown-toggle"
                    type="button"
                    id="userDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="bi bi-gear me-1"></i>
                    Account
                  </button>
                  <ul
                    className="dropdown-menu dropdown-menu-end"
                    aria-labelledby="userDropdown"
                  >
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        <i className="bi bi-person me-2"></i>
                        My Profile
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button
                        className="dropdown-item text-danger"
                        onClick={handleLogout}
                      >
                        <i className="bi bi-box-arrow-right me-2"></i>
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div>
                <Link
                  to="/student-login"
                  className="btn btn-outline-light me-2"
                >
                  <i className="bi bi-mortarboard me-1"></i>
                  Student
                </Link>
                <Link to="/college-login" className="btn btn-light">
                  <i className="bi bi-building me-1"></i>
                  Organizer
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
