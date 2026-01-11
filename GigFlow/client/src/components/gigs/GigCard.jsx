import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, DollarSign, Users, Clock, ArrowRight } from "lucide-react";

const GigCard = ({ gig, index = 0 }) => {
  const getDaysUntilDeadline = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = getDaysUntilDeadline(gig.deadline);

  const getCategoryBadgeClass = (category) => {
    const classes = {
      "Web Development": "badge-info",
      "Mobile Development": "badge-info",
      "UI/UX Design": "badge-primary",
      "Graphic Design": "badge-primary",
      "Content Writing": "badge-warning",
      "Digital Marketing": "badge-success",
      "Video Editing": "badge-danger",
      "Data Entry": "badge-outline",
      "Virtual Assistant": "badge-outline",
      Other: "badge-outline",
    };
    return classes[category] || "badge-outline";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link to={`/gigs/${gig._id}`}>
        <motion.article
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.99 }}
          className="group nexus-card-hover h-full cursor-pointer"
        >
          {/* Top Accent Line */}
          <div className="h-1 bg-gradient-to-r from-accent-orange to-accent-orange-hover" />

          <div className="p-4 sm:p-6 flex flex-col h-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-4">
              <span
                className={`self-start ${getCategoryBadgeClass(gig.category)}`}
              >
                {gig.category}
              </span>
              <div className="text-left sm:text-right">
                <span className="text-2xl font-display font-bold text-status-online">
                  ${gig.budget?.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-base sm:text-lg font-display font-bold text-white mb-2 line-clamp-2 group-hover:text-accent-orange transition-colors">
              {gig.title}
            </h3>

            {/* Description */}
            <p className="text-xs sm:text-sm text-text-secondary line-clamp-3 mb-4 flex-grow leading-relaxed">
              {gig.description}
            </p>

            {/* Skills */}
            {gig.skills && gig.skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
                {gig.skills.slice(0, 3).map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 text-xs font-mono bg-white/5 text-text-secondary border border-white/5"
                  >
                    {skill}
                  </span>
                ))}
                {gig.skills.length > 3 && (
                  <span className="px-2 py-1 text-xs font-mono bg-accent-orange/10 text-accent-orange border border-accent-orange/20">
                    +{gig.skills.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 pt-4 border-t border-white/5">
              {/* Client */}
              <div className="flex items-center gap-2">
                <img
                  src={gig.client?.avatar}
                  alt={gig.client?.name}
                  className="w-7 h-7 sm:w-8 sm:h-8 object-cover"
                />
                <span className="text-xs font-mono text-text-muted truncate max-w-[80px] sm:max-w-[100px]">
                  {gig.client?.name}
                </span>
              </div>

              {/* Meta Info */}
              <div className="flex items-center gap-4 text-xs font-mono text-text-muted">
                {/* Deadline */}
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span
                    className={
                      daysLeft <= 3
                        ? "text-red-400"
                        : daysLeft <= 7
                        ? "text-status-warning"
                        : ""
                    }
                  >
                    {daysLeft}D
                  </span>
                </div>

                {/* Bids */}
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>{gig.bidsCount || 0} BIDS</span>
                </div>
              </div>
            </div>

            {/* View Details Button */}
            <div className="mt-4">
              <button className="btn-primary w-full">
                VIEW DETAILS
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.article>
      </Link>
    </motion.div>
  );
};

export default GigCard;
