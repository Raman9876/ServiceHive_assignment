import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import { getMe, setLoading } from "./store/slices/authSlice";
import { SocketProvider } from "./context/SocketContext";

// Layout
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import GigFeed from "./pages/gigs/GigFeed";
import GigDetails from "./pages/gigs/GigDetails";
import CreateGig from "./pages/gigs/CreateGig";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

// Components
import ProtectedRoute from "./components/auth/ProtectedRoute";
import LoadingSpinner from "./components/ui/LoadingSpinner";

function App() {
  const dispatch = useDispatch();
  const { isLoading, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await dispatch(getMe()).unwrap();
      } catch (error) {
        // User not authenticated, that's okay
      } finally {
        dispatch(setLoading(false));
      }
    };

    checkAuth();
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <LoadingSpinner size="large" text="Loading GigFlow..." />
      </div>
    );
  }

  return (
    <Router>
      <SocketProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/gigs" element={<GigFeed />} />
              <Route
                path="/Gigfeed"
                element={<Navigate to="/gigs" replace />}
              />
              <Route
                path="/gigfeed"
                element={<Navigate to="/gigs" replace />}
              />
              <Route
                path="/GigFeed"
                element={<Navigate to="/gigs" replace />}
              />
              <Route path="/gigs/:id" element={<GigDetails />} />

              {/* Protected Routes */}
              <Route
                path="/gigs/create"
                element={
                  <ProtectedRoute>
                    <CreateGig />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>

        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#1e293b",
              color: "#f8fafc",
              borderRadius: "12px",
              padding: "16px",
              fontSize: "14px",
            },
            success: {
              iconTheme: {
                primary: "#10b981",
                secondary: "#f8fafc",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#f8fafc",
              },
            },
          }}
        />
      </SocketProvider>
    </Router>
  );
}

export default App;
