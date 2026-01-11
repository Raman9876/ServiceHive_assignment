import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchMyPostedGigs,
  completeGig,
  fetchGig,
} from "../store/slices/gigSlice";
import { fetchMyBids, fetchBidStats } from "../store/slices/bidSlice";
import { useSocket } from "../context/SocketContext";
import {
  Briefcase,
  FileText,
  DollarSign,
  Clock,
  CheckCircle,
  Plus,
  Users,
  Target,
  ChevronRight,
  TrendingUp,
  Zap,
  LayoutDashboard,
  Bell,
  X,
  Activity,
} from "lucide-react";
import toast from "react-hot-toast";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { myPostedGigs, isLoading: gigsLoading } = useSelector(
    (state) => state.gigs
  );
  const {
    myBids,
    stats,
    isLoading: bidsLoading,
  } = useSelector((state) => state.bids);
  const { socket, isConnected } = useSocket();

  const [activeTab, setActiveTab] = useState("posted");
  const [statusFilter, setStatusFilter] = useState("all");
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    dispatch(fetchBidStats());
    dispatch(fetchMyPostedGigs({ status: "all" }));
    dispatch(fetchMyBids({ status: "all" }));
  }, [dispatch]);

  useEffect(() => {
    if (socket && isConnected) {
      const handleNewBid = (data) => {
        const notification = {
          id: Date.now(),
          type: "new_bid",
          message: `New bid of $${data.amount} received`,
          gigTitle: data.gigTitle || "Your gig",
          timestamp: new Date(),
          read: false,
        };
        setNotifications((prev) => [notification, ...prev].slice(0, 20));
        dispatch(fetchMyPostedGigs({ status: "all" }));
      };

      const handleHired = (data) => {
        const notification = {
          id: Date.now(),
          type: "hired",
          message: `You've been hired for: ${data.gigTitle || data.message}`,
          gigTitle: data.gigTitle || data.message,
          amount: data.amount,
          timestamp: new Date(),
          read: false,
        };
        setNotifications((prev) => [notification, ...prev].slice(0, 20));
        dispatch(fetchMyBids({ status: "all" }));
        dispatch(fetchBidStats());
      };

      socket.on("new_bid", handleNewBid);
      socket.on("notification:hired", handleHired);

      return () => {
        socket.off("new_bid", handleNewBid);
        socket.off("notification:hired", handleHired);
      };
    }
  }, [socket, isConnected, dispatch]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleCompleteGig = async (gigId, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm("Mark this gig as completed?")) return;

    try {
      await dispatch(completeGig(gigId)).unwrap();
      toast.success("Gig marked as completed!");
    } catch (error) {
      toast.error(error || "Failed to complete gig");
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      open: "badge-success",
      assigned: "badge-info",
      completed: "badge-outline",
      pending: "badge-warning",
      hired: "badge-success",
      rejected: "badge-danger",
    };

    const labels = {
      open: "OPEN",
      assigned: "IN PROGRESS",
      completed: "COMPLETED",
      pending: "PENDING",
      hired: "HIRED",
      rejected: "NOT SELECTED",
    };

    return (
      <span className={styles[status] || "badge-outline"}>
        {labels[status] || status}
      </span>
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const filteredGigs =
    statusFilter === "all"
      ? myPostedGigs
      : myPostedGigs.filter((gig) => gig.status === statusFilter);

  const filteredBids =
    statusFilter === "all"
      ? myBids
      : myBids.filter((bid) => bid.status === statusFilter);

  const isLoading = activeTab === "posted" ? gigsLoading : bidsLoading;
  const displayItems = activeTab === "posted" ? filteredGigs : filteredBids;

  const statsData = [
    {
      label: "GIGS POSTED",
      value: stats?.client?.totalPostedGigs || 0,
      icon: Briefcase,
    },
    {
      label: "COMPLETED",
      value: stats?.client?.completedGigs || 0,
      icon: CheckCircle,
    },
    {
      label: "BIDS SUBMITTED",
      value: stats?.freelancer?.totalBids || 0,
      icon: FileText,
    },
    {
      label: "SUCCESS RATE",
      value: `${stats?.freelancer?.successRate || 0}%`,
      icon: Target,
    },
  ];

  return (
    <div className="min-h-screen bg-nexus-black">
      {/* Grid Background */}
      <div className="fixed inset-0 bg-grid opacity-30 pointer-events-none" />

      {/* Cyan Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-glow-cyan/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="hidden lg:flex flex-col w-72 p-6 border-r border-white/5"
        >
          {/* User Card */}
          <div className="nexus-card p-4 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={user?.avatar}
                alt={user?.name}
                className="w-12 h-12 object-cover"
              />
              <div>
                <h3 className="font-medium text-white truncate">
                  {user?.name}
                </h3>
                <p className="text-xs font-mono text-text-muted">
                  {user?.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-status-online/10 border border-status-online/20">
              <Zap className="w-4 h-4 text-status-online" />
              <span className="text-xs font-mono text-status-online">
                PRO MEMBER
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1 flex-1">
            <Link
              to="/dashboard"
              className="flex items-center gap-3 px-4 py-3 text-white bg-accent-orange/10 border-l-2 border-accent-orange"
            >
              <LayoutDashboard className="w-5 h-5 text-accent-orange" />
              <span className="text-sm font-mono tracking-wider">
                DASHBOARD
              </span>
            </Link>
            <Link
              to="/gigs"
              className="flex items-center gap-3 px-4 py-3 text-text-secondary hover:text-white hover:bg-white/5 transition-colors"
            >
              <Briefcase className="w-5 h-5" />
              <span className="text-sm font-mono tracking-wider">
                FIND WORK
              </span>
            </Link>
            <Link
              to="/gigs/create"
              className="flex items-center gap-3 px-4 py-3 text-text-secondary hover:text-white hover:bg-white/5 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span className="text-sm font-mono tracking-wider">POST GIG</span>
            </Link>
          </nav>

          {/* Quick Stats */}
          <div className="nexus-card p-4 mt-auto">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-accent-orange" />
              <span className="text-xs font-mono text-text-muted tracking-wider">
                THIS MONTH
              </span>
            </div>
            <div className="text-3xl font-display font-bold text-white">
              ${stats?.freelancer?.totalEarned || 0}
            </div>
            <p className="text-xs font-mono text-text-muted">TOTAL EARNINGS</p>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto relative">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
          >
            <div>
              <span className="section-label">CONTROL CENTER</span>
              <h1 className="text-display text-3xl text-white">
                Welcome back, {user?.name?.split(" ")[0]}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              {/* Connection Status */}
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 nexus-card">
                <span
                  className={isConnected ? "status-online" : "status-offline"}
                />
                <span className="text-xs font-mono text-text-muted">
                  {isConnected ? "LIVE" : "OFFLINE"}
                </span>
              </div>

              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-3 nexus-card hover:border-accent-orange/30 transition-colors"
                >
                  <Bell className="w-5 h-5 text-text-secondary" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-orange flex items-center justify-center text-xs font-bold text-white">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-80 nexus-card overflow-hidden z-50"
                    >
                      <div className="p-4 border-b border-white/5 flex items-center justify-between">
                        <span className="text-sm font-mono text-white">
                          NOTIFICATIONS
                        </span>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllRead}
                            className="text-xs font-mono text-accent-orange hover:text-accent-orange-hover"
                          >
                            MARK ALL READ
                          </button>
                        )}
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center">
                            <Bell className="w-8 h-8 text-text-muted mx-auto mb-2" />
                            <p className="text-sm text-text-muted">
                              No notifications
                            </p>
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div
                              key={notif.id}
                              className={`p-4 border-b border-white/5 ${
                                !notif.read ? "bg-accent-orange/5" : ""
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className="text-sm text-white">
                                    {notif.message}
                                  </p>
                                  <p className="text-xs font-mono text-text-muted mt-1">
                                    {new Date(
                                      notif.timestamp
                                    ).toLocaleTimeString()}
                                  </p>
                                </div>
                                <button
                                  onClick={() => clearNotification(notif.id)}
                                  className="text-text-muted hover:text-white"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            {statsData.map((stat, index) => (
              <div key={index} className="nexus-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className="w-5 h-5 text-accent-orange" />
                  <Activity className="w-4 h-4 text-text-muted" />
                </div>
                <div className="text-3xl font-display font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-xs font-mono text-text-muted tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="nexus-card"
          >
            {/* Tabs */}
            <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="tabs-list">
                <button
                  onClick={() => setActiveTab("posted")}
                  className={`tab-trigger ${
                    activeTab === "posted" ? "active" : ""
                  }`}
                >
                  MY GIGS
                </button>
                <button
                  onClick={() => setActiveTab("bids")}
                  className={`tab-trigger ${
                    activeTab === "bids" ? "active" : ""
                  }`}
                >
                  MY BIDS
                </button>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="input text-sm py-2 w-auto"
                >
                  <option value="all">ALL STATUS</option>
                  <option value="open">OPEN</option>
                  <option value="assigned">IN PROGRESS</option>
                  <option value="completed">COMPLETED</option>
                  {activeTab === "bids" && (
                    <>
                      <option value="pending">PENDING</option>
                      <option value="hired">HIRED</option>
                    </>
                  )}
                </select>

                <Link to={activeTab === "posted" ? "/gigs/create" : "/gigs"}>
                  <button className="btn-primary btn-sm">
                    <Plus className="w-4 h-4" />
                    {activeTab === "posted" ? "NEW GIG" : "FIND WORK"}
                  </button>
                </Link>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="p-4 nexus-card">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 skeleton" />
                          <div className="flex-1">
                            <div className="h-5 w-2/3 skeleton mb-2" />
                            <div className="h-4 w-1/3 skeleton" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                ) : displayItems.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-16"
                  >
                    <div className="w-16 h-16 nexus-card flex items-center justify-center mx-auto mb-4">
                      {activeTab === "posted" ? (
                        <Briefcase className="w-8 h-8 text-accent-orange" />
                      ) : (
                        <FileText className="w-8 h-8 text-accent-orange" />
                      )}
                    </div>
                    <h3 className="text-lg font-display text-white mb-2">
                      {activeTab === "posted"
                        ? "NO GIGS POSTED"
                        : "NO BIDS YET"}
                    </h3>
                    <p className="text-sm text-text-secondary mb-6 max-w-sm mx-auto">
                      {activeTab === "posted"
                        ? "Post your first gig to start receiving proposals from freelancers."
                        : "Browse available gigs and submit your first bid."}
                    </p>
                    <Link
                      to={activeTab === "posted" ? "/gigs/create" : "/gigs"}
                    >
                      <button className="btn-primary">
                        {activeTab === "posted" ? (
                          <>
                            <Plus className="w-4 h-4" />
                            POST A GIG
                          </>
                        ) : (
                          <>
                            <Briefcase className="w-4 h-4" />
                            BROWSE GIGS
                          </>
                        )}
                      </button>
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-2"
                  >
                    {activeTab === "posted"
                      ? filteredGigs.map((gig, index) => (
                          <motion.div
                            key={gig._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <Link
                              to={`/gigs/${gig._id}`}
                              className="flex items-center gap-4 p-4 nexus-card-hover group"
                            >
                              <div className="w-12 h-12 bg-accent-orange/10 border border-accent-orange/20 flex items-center justify-center">
                                <Briefcase className="w-5 h-5 text-accent-orange" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-white truncate group-hover:text-accent-orange transition-colors">
                                  {gig.title}
                                </h4>
                                <div className="flex items-center gap-4 text-xs font-mono text-text-muted mt-1">
                                  <span className="flex items-center gap-1">
                                    <DollarSign className="w-3 h-3" />
                                    {gig.budget}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Users className="w-3 h-3" />
                                    {gig.bidsCount || 0} BIDS
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {formatDate(gig.deadline)}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                {getStatusBadge(gig.status)}
                                {gig.status === "assigned" && (
                                  <button
                                    onClick={(e) =>
                                      handleCompleteGig(gig._id, e)
                                    }
                                    className="btn-success btn-sm"
                                  >
                                    <CheckCircle className="w-3 h-3" />
                                    COMPLETE
                                  </button>
                                )}
                                <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-accent-orange transition-colors" />
                              </div>
                            </Link>
                          </motion.div>
                        ))
                      : filteredBids.map((bid, index) => (
                          <motion.div
                            key={bid._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <Link
                              to={`/gigs/${bid.gig?._id}`}
                              className="flex items-center gap-4 p-4 nexus-card-hover group"
                            >
                              <div className="w-12 h-12 bg-glow-cyan/10 border border-glow-cyan/20 flex items-center justify-center">
                                <FileText className="w-5 h-5 text-glow-cyan" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-white truncate group-hover:text-accent-orange transition-colors">
                                  {bid.gig?.title}
                                </h4>
                                <div className="flex items-center gap-4 text-xs font-mono text-text-muted mt-1">
                                  <span className="flex items-center gap-1">
                                    <DollarSign className="w-3 h-3" />
                                    YOUR BID: ${bid.amount}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {bid.deliveryTime} DAYS
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                {getStatusBadge(bid.status)}
                                <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-accent-orange transition-colors" />
                              </div>
                            </Link>
                          </motion.div>
                        ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
