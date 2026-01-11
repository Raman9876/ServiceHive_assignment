import mongoose from 'mongoose';

const gigSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Gig title is required'],
      trim: true,
      minlength: [10, 'Title must be at least 10 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: [50, 'Description must be at least 50 characters'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    budget: {
      type: Number,
      required: [true, 'Budget is required'],
      min: [10, 'Budget must be at least $10'],
      max: [100000, 'Budget cannot exceed $100,000'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Web Development',
        'Mobile Development',
        'UI/UX Design',
        'Graphic Design',
        'Content Writing',
        'Digital Marketing',
        'Video Editing',
        'Data Entry',
        'Virtual Assistant',
        'Other',
      ],
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    status: {
      type: String,
      enum: ['open', 'assigned', 'completed', 'cancelled'],
      default: 'open',
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedFreelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    assignedBid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bid',
      default: null,
    },
    deadline: {
      type: Date,
      required: [true, 'Deadline is required'],
    },
    bidsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for bids
gigSchema.virtual('bids', {
  ref: 'Bid',
  localField: '_id',
  foreignField: 'gig',
});

// Index for search functionality
gigSchema.index({ title: 'text', description: 'text' });
gigSchema.index({ status: 1, createdAt: -1 });
gigSchema.index({ client: 1 });
gigSchema.index({ category: 1 });

const Gig = mongoose.model('Gig', gigSchema);

export default Gig;
