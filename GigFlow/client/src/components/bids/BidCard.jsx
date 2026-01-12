import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { hireBid } from "../../store/slices/bidSlice";
import { updateCurrentGigStatus, fetchGig } from "../../store/slices/gigSlice";
import { DollarSign, Clock, CheckCircle, Loader2, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import HireSuccessModal from "../ui/HireSuccessModal";

const BidCard = ({ bid, isOwner, gigStatus, gigId, onHireComplete }) => {
  const dispatch = useDispatch();
  const { isHiring } = useSelector((state) => state.bids);
  const [isHiringThisBid, setIsHiringThisBid] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [localStatus, setLocalStatus] = useState(bid.status);

  // Sync local status with prop changes (e.g., when gig is refetched)
  useEffect(() => {
    setLocalStatus(bid.status);
  }, [bid.status]);

  const getStatusBadge = (status) => {
    const currentStatus = localStatus || status;
    switch (currentStatus) {
      case "pending":
        return (
          <span className="px-2 sm:px-3 py-1 text-xs font-mono bg-status-warning/20 text-status-warning border border-status-warning/30">
            PENDING
          </span>
        );
      case "hired":
        return (
          <span className="px-2 sm:px-3 py-1 text-xs font-mono bg-status-online/20 text-status-online border border-status-online/30 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            HIRED
          </span>
        );
      case "rejected":
        return (
          <span className="px-2 sm:px-3 py-1 text-xs font-mono bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            NOT SELECTED
          </span>
        );
      case "withdrawn":
        return (
          <span className="px-2 sm:px-3 py-1 text-xs font-mono bg-white/10 text-text-muted border border-white/20">
            WITHDRAWN
          </span>
        );
      default:
        return null;
    }
  };

  const handleHire = async () => {
    if (
      !window.confirm(`Are you sure you want to hire ${bid.freelancer?.name}?`)
    ) {
      return;
    }

    setIsHiringThisBid(true);
    try {
      await dispatch(hireBid(bid._id)).unwrap();

      // Immediately update local state to show "Hired"
      setLocalStatus("hired");

      // 🎉 Trigger confetti celebration for the client!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#10b981", "#fbbf24", "#ff4d00", "#00d4ff"],
      });
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#10b981", "#34d399", "#6ee7b7"],
        });
      }, 200);
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#ff4d00", "#00d4ff", "#a855f7"],
        });
      }, 400);

      // Show success toast
      toast.success(`Successfully hired ${bid.freelancer?.name}! 🎉`, {
        duration: 5000,
        style: {
          background: "#10b981",
          color: "#fff",
          fontWeight: "bold",
        },
      });

      // Update gig status in Redux
      dispatch(
        updateCurrentGigStatus({
          status: "assigned",
          assignedFreelancer: bid.freelancer,
        })
      );

      // Notify parent to update other bids to "rejected"
      if (onHireComplete) {
        onHireComplete(bid._id);
      }

      // Refetch the gig to get all updated bid statuses
      if (gigId) {
        dispatch(fetchGig(gigId));
      }

      setShowSuccessModal(true);
    } catch (error) {
      toast.error(error || "Failed to hire freelancer");
    } finally {
      setIsHiringThisBid(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date)
      .toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
      .toUpperCase();
  };

  const currentStatus = localStatus || bid.status;

  const cardStyles =
    currentStatus === "hired"
      ? "border-status-online/30 bg-status-online/5"
      : currentStatus === "rejected"
      ? "border-white/5 bg-white/[0.02] opacity-60"
      : "border-white/10 bg-nexus-black";

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-4 sm:p-5 border ${cardStyles}`}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <img
              src={bid.freelancer?.avatar}
              alt={bid.freelancer?.name}
              className="w-10 h-10 sm:w-12 sm:h-12 object-cover border-2 border-accent-orange/50"
            />
            <div>
              <h4 className="font-display font-semibold text-white text-sm sm:text-base">
                {bid.freelancer?.name}
              </h4>
              <p className="text-xs font-mono text-text-muted">
                {bid.freelancer?.gigsCompleted || 0} GIGS COMPLETED
              </p>
            </div>
          </div>
          {getStatusBadge(currentStatus)}
        </div>

        {/* Bid Details */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 p-3 bg-white/5 border border-white/10">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-status-online flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-mono text-text-muted">BID AMOUNT</p>
              <p className="font-display font-semibold text-white text-sm sm:text-base truncate">
                ${bid.amount}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-glow-cyan flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-mono text-text-muted">DELIVERY</p>
              <p className="font-display font-semibold text-white text-sm sm:text-base">
                {bid.deliveryTime} DAYS
              </p>
            </div>
          </div>
        </div>

        {/* Proposal Message */}
        <div className="mb-4">
          <h5 className="text-xs font-mono text-glow-cyan mb-2">PROPOSAL</h5>
          <p className="text-sm text-text-secondary leading-relaxed">
            {bid.message}
          </p>
        </div>

        {/* Freelancer Skills */}
        {bid.freelancer?.skills && bid.freelancer.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {bid.freelancer.skills.slice(0, 5).map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs font-mono bg-white/5 text-text-muted border border-white/10"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-white/10">
          <p className="text-xs font-mono text-text-muted">
            SUBMITTED {formatDate(bid.createdAt)}
          </p>

          {/* Hire Button - only show if pending and gig is open */}
          {isOwner && currentStatus === "pending" && gigStatus === "open" && (
            <button
              onClick={handleHire}
              disabled={isHiring}
              className="w-full sm:w-auto px-4 py-2 font-mono text-sm flex items-center justify-center gap-2 bg-status-online hover:bg-status-online/90 text-white disabled:opacity-50 transition-colors"
            >
              {isHiringThisBid ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  HIRING...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  HIRE
                </>
              )}
            </button>
          )}
        </div>
      </motion.div>

      {/* Success Modal */}
      <HireSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        freelancerName={bid.freelancer?.name}
      />
    </>
  );
};

export default BidCard;
