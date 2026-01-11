import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { CheckCircle, X, Zap, Terminal } from "lucide-react";

const HireSuccessModal = ({ isOpen, onClose, freelancerName }) => {
  useEffect(() => {
    if (isOpen) {
      // Fire confetti
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = {
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        zIndex: 9999,
      };

      const randomInRange = (min, max) => Math.random() * (max - min) + min;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ["#ff4d00", "#00d4ff", "#22c55e", "#ffffff"],
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ["#ff4d00", "#00d4ff", "#22c55e", "#ffffff"],
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-nexus-black/90 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-md nexus-card text-center overflow-hidden">
              {/* Top accent line */}
              <div className="h-1 bg-gradient-to-r from-status-online to-glow-cyan" />

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 text-text-muted hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Glow Effect */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[100px] bg-status-online/20 blur-[60px] rounded-full pointer-events-none" />

              {/* Content */}
              <div className="relative p-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  {/* Success Icon */}
                  <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center bg-status-online">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        delay: 0.4,
                        type: "spring",
                        stiffness: 200,
                      }}
                    >
                      <CheckCircle className="w-12 h-12 text-white" />
                    </motion.div>
                  </div>

                  {/* Title */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Zap className="w-5 h-5 text-accent-orange" />
                      <span className="text-xs font-mono text-glow-cyan tracking-wider">
                        SUCCESS
                      </span>
                      <Zap className="w-5 h-5 text-accent-orange" />
                    </div>
                    <h2 className="text-2xl font-display font-bold text-white">
                      CONGRATULATIONS!
                    </h2>
                    <p className="text-text-secondary font-mono text-sm mt-2">
                      Freelancer Hired Successfully
                    </p>
                  </motion.div>

                  {/* Freelancer Name */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-6 p-4 bg-white/5 border border-white/10"
                  >
                    <p className="text-xs font-mono text-text-muted mb-1">
                      YOU&apos;VE HIRED
                    </p>
                    <p className="text-lg font-display font-semibold text-white flex items-center justify-center gap-2">
                      <Terminal className="w-5 h-5 text-accent-orange" />
                      {freelancerName}
                    </p>
                  </motion.div>

                  {/* Message */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="text-sm text-text-secondary mt-6 font-mono"
                  >
                    They will receive a notification and can start working on
                    your project right away!
                  </motion.p>

                  {/* Action Button */}
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    onClick={onClose}
                    className="btn-primary w-full mt-6"
                  >
                    AWESOME!
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default HireSuccessModal;
