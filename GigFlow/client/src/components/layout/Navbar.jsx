import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { logout } from "../../store/slices/authSlice";
import { useSocket } from "../../context/SocketContext";
import {
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  Search,
  Plus,
  ChevronDown,
  Zap,
} from "lucide-react";
import toast from "react-hot-toast";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { isConnected } = useSocket();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Logout failed");
    }
    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: "/gigs", label: "FIND WORK", icon: Search },
    ...(isAuthenticated
      ? [
          { path: "/gigs/create", label: "POST GIG", icon: Plus },
          { path: "/dashboard", label: "DASHBOARD", icon: LayoutDashboard },
        ]
      : []),
  ];

  return (
    <>
      {/* NEXUS-Style Navbar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-nexus-black/95 backdrop-blur-md border-b border-white/5"
            : "bg-transparent"
        }`}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-8 h-8 flex items-center justify-center bg-accent-orange">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <div className="absolute inset-0 bg-accent-orange blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              </div>
              <span className="text-lg font-bold tracking-tight font-display">
                GIG<span className="text-accent-orange">FLOW</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path}>
                  <span
                    className={`text-xs font-medium tracking-widest transition-colors font-mono ${
                      isActive(link.path)
                        ? "text-accent-orange"
                        : "text-text-secondary hover:text-white"
                    }`}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {/* System Status */}
              <div className="hidden sm:flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isConnected ? "status-online" : "status-offline"
                  }`}
                />
                <span className="text-xs font-mono tracking-wider text-status-online">
                  {isConnected ? "SYSTEM ONLINE" : "OFFLINE"}
                </span>
              </div>

              {isAuthenticated ? (
                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 border border-white/10 hover:border-accent-orange/50 transition-colors"
                  >
                    <img
                      src={user?.avatar}
                      alt={user?.name}
                      className="w-6 h-6 object-cover"
                    />
                    <ChevronDown
                      className={`w-4 h-4 text-text-secondary transition-transform duration-300 ${
                        isProfileMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isProfileMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-56 nexus-card border border-white/10 overflow-hidden"
                      >
                        <div className="p-4 border-b border-white/5">
                          <p className="text-sm font-medium text-white truncate">
                            {user?.name}
                          </p>
                          <p className="text-xs text-text-muted font-mono truncate">
                            {user?.email}
                          </p>
                        </div>

                        <div className="p-2">
                          <Link
                            to="/dashboard"
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 text-xs font-mono tracking-wider text-text-secondary hover:text-white hover:bg-white/5 transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            DASHBOARD
                          </Link>

                          <Link
                            to="/profile"
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 text-xs font-mono tracking-wider text-text-secondary hover:text-white hover:bg-white/5 transition-colors"
                          >
                            <User className="w-4 h-4" />
                            PROFILE
                          </Link>

                          <div className="my-2 border-t border-white/5" />

                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-3 py-2 text-xs font-mono tracking-wider text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-colors w-full"
                          >
                            <LogOut className="w-4 h-4" />
                            LOGOUT
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/login">
                    <button className="px-4 py-2 text-xs font-mono tracking-wider text-text-secondary hover:text-white transition-colors border border-white/10 hover:border-white/20">
                      LOGIN
                    </button>
                  </Link>
                  <Link to="/register">
                    <button className="btn-primary btn-sm">GET STARTED</button>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-text-secondary hover:text-white transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-nexus-black/95 backdrop-blur-md"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute right-0 top-0 bottom-0 w-72 bg-nexus-dark border-l border-white/5"
            >
              <div className="p-6">
                <div className="flex justify-end mb-8">
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-text-secondary hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-1">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={link.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 text-xs font-mono tracking-wider transition-all ${
                          isActive(link.path)
                            ? "text-accent-orange bg-accent-orange/10 border-l-2 border-accent-orange"
                            : "text-text-secondary hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <link.icon className="w-4 h-4" />
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {!isAuthenticated && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8 space-y-3"
                  >
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full px-4 py-3 text-center text-xs font-mono tracking-wider text-text-secondary border border-white/10 hover:border-white/20 transition-colors"
                    >
                      LOGIN
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <button className="btn-primary w-full">
                        GET STARTED
                      </button>
                    </Link>
                  </motion.div>
                )}

                {isAuthenticated && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8 pt-4 border-t border-white/5"
                  >
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-3 text-xs font-mono tracking-wider text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-colors w-full"
                    >
                      <LogOut className="w-4 h-4" />
                      LOGOUT
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed navbar */}
      <div className="h-16" />
    </>
  );
};

export default Navbar;
