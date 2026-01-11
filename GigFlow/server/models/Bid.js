import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema(
  {
    gig: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gig',
      required: true,
    },
    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: [true, 'Bid amount is required'],
      min: [5, 'Bid amount must be at least $5'],
    },
    message: {
      type: String,
      required: [true, 'Proposal message is required'],
      minlength: [20, 'Message must be at least 20 characters'],
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
    deliveryTime: {
      type: Number,
      required: [true, 'Delivery time is required'],
      min: [1, 'Delivery time must be at least 1 day'],
    },
    status: {
      type: String,
      enum: ['pending', 'hired', 'rejected', 'withdrawn'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Ensure one bid per freelancer per gig
bidSchema.index({ gig: 1, freelancer: 1 }, { unique: true });
bidSchema.index({ freelancer: 1, status: 1 });
bidSchema.index({ gig: 1, status: 1 });

const Bid = mongoose.model('Bid', bidSchema);

export default Bid;
