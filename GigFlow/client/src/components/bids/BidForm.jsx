import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { createBid } from "../../store/slices/bidSlice";
import { updateGigBidsCount } from "../../store/slices/gigSlice";
import { DollarSign, Clock, Send, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const BidForm = ({ gigId, budget, onSuccess }) => {
  const dispatch = useDispatch();
  const { isSubmitting } = useSelector((state) => state.bids);

  const [formData, setFormData] = useState({
    amount: "",
    message: "",
    deliveryTime: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.amount || formData.amount < 5) {
      newErrors.amount = "Bid amount must be at least $5";
    }

    if (!formData.message || formData.message.length < 20) {
      newErrors.message = "Message must be at least 20 characters";
    }

    if (!formData.deliveryTime || formData.deliveryTime < 1) {
      newErrors.deliveryTime = "Delivery time must be at least 1 day";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await dispatch(
        createBid({
          gigId,
          amount: Number(formData.amount),
          message: formData.message,
          deliveryTime: Number(formData.deliveryTime),
        })
      ).unwrap();

      dispatch(updateGigBidsCount({ gigId, increment: true }));
      toast.success("Bid submitted successfully!");
      setFormData({ amount: "", message: "", deliveryTime: "" });
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(error || "Failed to submit bid");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Client's Budget Display */}
      <div className="p-4 bg-accent-orange/10 border border-accent-orange/30">
        <p className="text-xs font-mono text-text-muted mb-1">
          CLIENT_BUDGET
        </p>
        <p className="text-2xl font-display font-bold text-status-online">
          ${budget?.toLocaleString()}
        </p>
      </div>

      {/* Bid Amount */}
      <div>
        <label className="section-label mb-2 flex items-center gap-2">
          <DollarSign className="w-4 h-4" /> BID_AMOUNT
        </label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            type="number"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            className={`input w-full pl-10 ${
              errors.amount ? "border-red-500/50" : ""
            }`}
            placeholder="Enter your bid amount"
          />
        </div>
        {errors.amount && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-red-400 mt-1 font-mono"
          >
            {errors.amount}
          </motion.p>
        )}
      </div>

      {/* Delivery Time */}
      <div>
        <label className="section-label mb-2 flex items-center gap-2">
          <Clock className="w-4 h-4" /> DELIVERY_TIME
        </label>
        <div className="relative">
          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            type="number"
            value={formData.deliveryTime}
            onChange={(e) =>
              setFormData({ ...formData, deliveryTime: e.target.value })
            }
            className={`input w-full pl-10 ${
              errors.deliveryTime ? "border-red-500/50" : ""
            }`}
            placeholder="Days to complete"
          />
        </div>
        {errors.deliveryTime && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-red-400 mt-1 font-mono"
          >
            {errors.deliveryTime}
          </motion.p>
        )}
      </div>

      {/* Message */}
      <div>
        <label className="section-label mb-2">PROPOSAL_MESSAGE</label>
        <textarea
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          className={`input w-full min-h-[120px] resize-none ${
            errors.message ? "border-red-500/50" : ""
          }`}
          placeholder="Describe why you're the best fit..."
        />
        <div className="flex justify-between mt-1">
          {errors.message && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-400 font-mono"
            >
              {errors.message}
            </motion.p>
          )}
          <p className="text-xs font-mono text-text-muted ml-auto">
            {formData.message.length}/1000
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            SUBMITTING...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            SUBMIT PROPOSAL
          </>
        )}
      </button>
    </form>
  );
};

export default BidForm;
