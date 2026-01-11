import { Search } from "lucide-react";
import { motion } from "framer-motion";

const EmptyState = ({
  icon: Icon = Search,
  title = "NO RESULTS FOUND",
  description = "Try adjusting your search or filters",
  action,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-20 px-4"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-20 h-20 flex items-center justify-center mb-6 bg-accent-orange/10 border border-accent-orange/30"
      >
        <Icon className="w-10 h-10 text-accent-orange" />
      </motion.div>
      <h3 className="text-xl font-display font-semibold text-white mb-2">
        {title}
      </h3>
      <p className="text-sm font-mono text-text-secondary text-center max-w-sm mb-6">
        {description}
      </p>
      {action && action}
    </motion.div>
  );
};

export default EmptyState;
