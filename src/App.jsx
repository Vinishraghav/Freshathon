// src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";
import { getUserRole } from "./services/FirebaseServices";

// Pages
import Home from "./pages/Home";
import StudentLogin from "./pages/StudentLogin";
import CollegeLogin from "./pages/CollegeLogin";
import EventDiscovery from "./pages/EventDiscovery";
import EventDetails from "./pages/EventDetails";
import AdminDashboard from "./pages/AdminDashboard";
import CreateEvent from "./pages/CreateEvent";
import EditEvent from "./pages/EditEvent";
import UserProfile from "./pages/UserProfile";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import LoadingSpinner from "./components/LoadingSpinner";

const App = () => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);

    if (savedDarkMode) {
      document.body.classList.add("dark-mode");
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const role = await getUserRole(currentUser.uid);
          setUserRole(role);
        } catch (error) {
          console.error("Error getting user role:", error);
        }
      } else {
        setUserRole(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());

    if (newDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar
          user={user}
          userRole={userRole}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />

        <main className="flex-grow-1">
          <div className="container mt-4 mb-5">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/student-login" element={<StudentLogin />} />
              <Route path="/college-login" element={<CollegeLogin />} />
              <Route path="/events" element={<EventDiscovery />} />
              <Route path="/events/:id" element={<EventDetails />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute user={user}>
                    <UserProfile />
                  </ProtectedRoute>
                }
              />

              {/* Protected Organizer Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute user={user} requiredRole="organizer">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/events/create"
                element={
                  <ProtectedRoute user={user} requiredRole="organizer">
                    <CreateEvent />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/events/edit/:id"
                element={
                  <ProtectedRoute user={user} requiredRole="organizer">
                    <EditEvent />
                  </ProtectedRoute>
                }
              />

              {/* Redirects */}
              <Route
                path="/student-dashboard"
                element={<Navigate to="/events" replace />}
              />
              <Route
                path="/college-dashboard"
                element={<Navigate to="/admin/dashboard" replace />}
              />

              {/* 404 Route */}
              <Route
                path="*"
                element={
                  <div className="text-center py-5">
                    <h1 className="display-1">404</h1>
                    <h2>Page Not Found</h2>
                    <p className="lead">
                      The page you are looking for does not exist.
                    </p>
                    <button
                      className="btn btn-primary mt-3"
                      onClick={() => window.history.back()}
                    >
                      Go Back
                    </button>
                  </div>
                }
              />
            </Routes>
          </div>
        </main>

        <Footer />
      </div>
    </Router>
  );
};

export default App;
