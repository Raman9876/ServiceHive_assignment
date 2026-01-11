import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { fetchGig, clearCurrentGig } from "../../store/slices/gigSlice";
import { useSocket } from "../../context/SocketContext";
import BidForm from "../../components/bids/BidForm";
import BidCard from "../../components/bids/BidCard";
import BidCardSkeleton from "../../components/bids/BidCardSkeleton";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Users,
  Clock,
  Tag,
  User,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Zap,
  Terminal,
} from "lucide-react";

const GigDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { joinGigRoom, leaveGigRoom } = useSocket();

  const { currentGig, isLoading } = useSelector((state) => state.gigs);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [showBidForm, setShowBidForm] = useState(false);
  const [localHasAlreadyBid, setLocalHasAlreadyBid] = useState(false);

  useEffect(() => {
    dispatch(fetchGig(id));
    if (isAuthenticated) joinGigRoom(id);
    return () => {
      dispatch(clearCurrentGig());
      if (isAuthenticated) leaveGigRoom(id);
    };
  }, [dispatch, id, isAuthenticated, joinGigRoom, leaveGigRoom]);

  // Listen for gig status changes via socket
  const { socket, isConnected } = useSocket();
  useEffect(() => {
    if (socket && isConnected) {
      const handleGigStatusChange = (data) => {
        console.log("📢 Gig status changed:", data);
        if (data.gigId === id) {
          dispatch(fetchGig(id));
        }
      };

      socket.on("gig:status_changed", handleGigStatusChange);

      return () => {
        socket.off("gig:status_changed", handleGigStatusChange);
      };
    }
  }, [socket, isConnected, id, dispatch]);

  // Update local bid state when currentGig changes
  useEffect(() => {
    if (currentGig && user) {
      const hasBid = currentGig.bids?.some(
        (bid) => bid.freelancer?._id === user?._id
      );
      setLocalHasAlreadyBid(hasBid);
    }
  }, [currentGig, user]);

  if (isLoading || !currentGig) {
    return (
      <div className="min-h-screen bg-nexus-black py-8">
        <div className="container-custom">
          <div className="mb-6">
            <div className="h-10 w-24 bg-white/10 animate-pulse" />
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="p-6 nexus-card">
                <div className="h-8 w-3/4 bg-white/10 mb-4 animate-pulse" />
                <div className="flex gap-4 mb-6">
                  <div className="h-6 w-24 bg-white/10 animate-pulse" />
                  <div className="h-6 w-32 bg-white/10 animate-pulse" />
                </div>
                <div className="space-y-3">
                  <div className="h-4 w-full bg-white/10 animate-pulse" />
                  <div className="h-4 w-full bg-white/10 animate-pulse" />
                  <div className="h-4 w-2/3 bg-white/10 animate-pulse" />
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="p-6 nexus-card">
                <div className="h-6 w-24 bg-white/10 mb-4 animate-pulse" />
                <div className="h-10 w-full bg-white/10 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isOwner = user?._id === currentGig.client?._id;
  const hasAlreadyBid =
    localHasAlreadyBid ||
    currentGig.bids?.some((bid) => bid.freelancer?._id === user?._id);
  const isOpen = currentGig.status === "open";
  const isAssigned = currentGig.status === "assigned";

  // Handler for successful bid submission
  const handleBidSuccess = () => {
    setShowBidForm(false);
    setLocalHasAlreadyBid(true);
    dispatch(fetchGig(id));
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  const getDaysUntilDeadline = (deadline) => {
    const diffTime = new Date(deadline) - new Date();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  const daysLeft = getDaysUntilDeadline(currentGig.deadline);

  const getStatusBadge = () => {
    const styles = {
      open: "status-online",
      assigned: "badge-info",
      completed: "badge-outline",
      cancelled: "badge-danger",
    };
    const labels = {
      open: "OPEN",
      assigned: "IN PROGRESS",
      completed: "COMPLETED",
      cancelled: "CANCELLED",
    };
    return (
      <span className={styles[currentGig.status]}>
        {labels[currentGig.status]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-nexus-black py-8 relative overflow-hidden">
      {/* Grid Background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 77, 0, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 77, 0, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Top Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-glow-cyan/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="container-custom relative z-10">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-text-muted hover:text-accent-orange transition-colors mb-6 font-mono text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> BACK TO GIGS
        </motion.button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Gig Details Card */}
            <div className="nexus-card overflow-hidden">
              {/* Orange Top Line */}
              <div className="h-1 bg-gradient-to-r from-accent-orange to-accent-orange-hover" />

              <div className="p-6">
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Terminal className="w-5 h-5 text-accent-orange" />
                      <span className="text-xs font-mono text-glow-cyan tracking-wider">
                        GIG_DETAILS
                      </span>
                    </div>
                    <h1 className="text-2xl font-display font-bold text-white mb-3">
                      {currentGig.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3">
                      {getStatusBadge()}
                      <span className="text-xs font-mono text-text-muted">
                        POSTED {formatDate(currentGig.createdAt).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono text-text-muted mb-1">
                      BUDGET
                    </p>
                    <p className="text-3xl font-display font-bold text-status-online">
                      ${currentGig.budget?.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Meta Info Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-white/5 border border-white/10 mb-6">
                  {[
                    {
                      icon: Tag,
                      label: "CATEGORY",
                      value: currentGig.category,
                    },
                    {
                      icon: Calendar,
                      label: "DEADLINE",
                      value: formatDate(currentGig.deadline),
                    },
                    {
                      icon: Clock,
                      label: "TIME LEFT",
                      value: daysLeft > 0 ? `${daysLeft} DAYS` : "DUE",
                      isUrgent: daysLeft <= 3,
                    },
                    {
                      icon: Users,
                      label: "BIDS",
                      value: `${currentGig.bids?.length || 0} PROPOSALS`,
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-accent-orange/10 flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-accent-orange" />
                      </div>
                      <div>
                        <p className="text-xs font-mono text-text-muted">
                          {item.label}
                        </p>
                        <p
                          className={`text-sm font-mono font-medium ${
                            item.isUrgent ? "text-status-warning" : "text-white"
                          }`}
                        >
                          {item.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h2 className="section-label mb-3">DESCRIPTION</h2>
                  <p className="whitespace-pre-wrap text-text-secondary leading-relaxed">
                    {currentGig.description}
                  </p>
                </div>

                {/* Skills */}
                {currentGig.skills?.length > 0 && (
                  <div>
                    <h2 className="section-label mb-3">REQUIRED_SKILLS</h2>
                    <div className="flex flex-wrap gap-2">
                      {currentGig.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 bg-white/5 text-text-secondary text-sm font-mono border border-white/10"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bids Section */}
            <div className="nexus-card overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-glow-cyan to-glow-cyan/50" />

              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="section-label flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-glow-cyan" />
                    PROPOSALS ({currentGig.bids?.length || 0})
                  </h2>
                </div>

                {currentGig.bids?.length > 0 ? (
                  <div className="space-y-4">
                    {currentGig.bids.map((bid) => (
                      <BidCard
                        key={bid._id}
                        bid={bid}
                        isOwner={isOwner}
                        gigStatus={currentGig.status}
                        gigId={id}
                        onHireComplete={() => dispatch(fetchGig(id))}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border border-dashed border-white/10">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 text-text-muted" />
                    <p className="text-text-secondary font-mono">
                      NO PROPOSALS YET
                    </p>
                    {!isOwner && isOpen && (
                      <p className="text-sm text-text-muted mt-1 font-mono">
                        Be the first to submit a bid!
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Client Card */}
            <div className="nexus-card p-6">
              <h3 className="section-label mb-4">POSTED_BY</h3>
              <div className="flex items-center gap-4">
                <img
                  src={currentGig.client?.avatar}
                  alt={currentGig.client?.name}
                  className="w-14 h-14 object-cover border-2 border-accent-orange/50"
                />
                <div>
                  <h4 className="font-display font-semibold text-white">
                    {currentGig.client?.name}
                  </h4>
                  <p className="text-xs font-mono text-text-muted">
                    {currentGig.client?.gigsPosted || 0} GIGS POSTED
                  </p>
                </div>
              </div>
            </div>

            {/* Action Card */}
            <div className="nexus-card p-6">
              {!isAuthenticated ? (
                <div>
                  <p className="text-sm text-text-secondary mb-4 font-mono">
                    Sign in to submit a proposal for this gig.
                  </p>
                  <Link to="/login" className="btn-primary w-full">
                    SIGN IN TO BID
                  </Link>
                </div>
              ) : isOwner ? (
                <div>
                  <div className="flex items-center gap-2 text-text-secondary mb-4">
                    <User className="w-5 h-5" />
                    <span className="font-mono text-sm">YOUR GIG</span>
                  </div>
                  {isAssigned && (
                    <div className="p-4 bg-status-online/10 border border-status-online/20">
                      <div className="flex items-center gap-2 text-status-online mb-1">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-mono text-sm">
                          FREELANCER HIRED
                        </span>
                      </div>
                      <p className="text-sm text-text-secondary font-mono">
                        You hired {currentGig.assignedFreelancer?.name}
                      </p>
                    </div>
                  )}
                  {isOpen && currentGig.bids?.length === 0 && (
                    <div className="p-4 bg-glow-cyan/10 border border-glow-cyan/20">
                      <p className="text-sm text-text-secondary font-mono">
                        Waiting for proposals...
                      </p>
                    </div>
                  )}
                </div>
              ) : isAssigned ? (
                <div className="p-4 bg-glow-cyan/10 border border-glow-cyan/20">
                  <div className="flex items-center gap-2 text-glow-cyan mb-1">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-mono text-sm">GIG ASSIGNED</span>
                  </div>
                  <p className="text-sm text-text-secondary font-mono">
                    This gig has been assigned to a freelancer.
                  </p>
                </div>
              ) : hasAlreadyBid ? (
                <div className="p-4 bg-status-online/10 border border-status-online/20">
                  <div className="flex items-center gap-2 text-status-online mb-1">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-mono text-sm">BID SUBMITTED</span>
                  </div>
                  <p className="text-sm text-text-secondary font-mono">
                    You&apos;ve submitted a proposal. Good luck!
                  </p>
                </div>
              ) : showBidForm ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-mono text-sm text-white">
                      SUBMIT_PROPOSAL
                    </h3>
                    <button
                      onClick={() => setShowBidForm(false)}
                      className="text-text-muted hover:text-white"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                  </div>
                  <BidForm
                    gigId={currentGig._id}
                    budget={currentGig.budget}
                    onSuccess={handleBidSuccess}
                  />
                </div>
              ) : (
                <div>
                  <p className="text-sm text-text-secondary mb-4 font-mono">
                    Interested in this project? Submit a proposal.
                  </p>
                  <button
                    onClick={() => setShowBidForm(true)}
                    className="btn-primary w-full"
                  >
                    <Zap className="w-4 h-4" />
                    SUBMIT PROPOSAL
                  </button>
                </div>
              )}
            </div>

            {/* Tips Card */}
            {!isOwner && isOpen && !hasAlreadyBid && (
              <div className="nexus-card p-6 border-l-2 border-l-accent-orange">
                <h3 className="font-display font-semibold text-white mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-accent-orange" />
                  PROPOSAL TIPS
                </h3>
                <ul className="text-sm text-text-secondary space-y-2 font-mono">
                  <li className="flex items-start gap-2">
                    <span className="text-accent-orange">→</span>
                    Read the description carefully
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent-orange">→</span>
                    Highlight relevant experience
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent-orange">→</span>
                    Be specific about your approach
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent-orange">→</span>
                    Set a realistic delivery time
                  </li>
                </ul>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default GigDetails;
