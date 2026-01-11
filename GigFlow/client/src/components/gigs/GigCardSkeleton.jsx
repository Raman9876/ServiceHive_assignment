import { motion } from "framer-motion";

const GigCardSkeleton = ({ index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="nexus-card overflow-hidden relative"
    >
      {/* Shimmer Overlay */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      {/* Top Accent Line */}
      <div className="h-1 bg-white/10" />

      <div className="p-6 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="h-6 w-28 bg-white/5" />
          <div className="h-8 w-20 bg-white/5" />
        </div>

        {/* Title */}
        <div className="h-6 w-full bg-white/5 mb-2" />
        <div className="h-6 w-3/4 bg-white/5 mb-4" />

        {/* Description */}
        <div className="space-y-2 mb-4 flex-grow">
          <div className="h-4 w-full bg-white/5" />
          <div className="h-4 w-full bg-white/5" />
          <div className="h-4 w-2/3 bg-white/5" />
        </div>

        {/* Skills */}
        <div className="flex gap-2 mb-4">
          <div className="h-7 w-16 bg-white/5" />
          <div className="h-7 w-20 bg-white/5" />
          <div className="h-7 w-14 bg-white/5" />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-white/5" />
            <div className="h-4 w-20 bg-white/5" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-4 w-12 bg-white/5" />
            <div className="h-4 w-8 bg-white/5" />
          </div>
        </div>

        {/* Button Placeholder */}
        <div className="mt-4">
          <div className="h-10 w-full bg-white/5" />
        </div>
      </div>
    </motion.div>
  );
};

export default GigCardSkeleton;
