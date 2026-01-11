import Gig from '../models/Gig.js';
import Bid from '../models/Bid.js';
import User from '../models/User.js';

// @desc    Get all open gigs with search/filter
// @route   GET /api/gigs
// @access  Public
export const getGigs = async (req, res) => {
  try {
    const { search, category, minBudget, maxBudget, sort, page = 1, limit = 12 } = req.query;

    // Build query
    const query = { status: 'open' };

    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }

    // Filter by budget range
    if (minBudget || maxBudget) {
      query.budget = {};
      if (minBudget) query.budget.$gte = Number(minBudget);
      if (maxBudget) query.budget.$lte = Number(maxBudget);
    }

    // Sort options
    let sortOption = { createdAt: -1 }; // Default: newest first
    if (sort === 'budget-high') sortOption = { budget: -1 };
    if (sort === 'budget-low') sortOption = { budget: 1 };
    if (sort === 'deadline') sortOption = { deadline: 1 };
    if (sort === 'bids') sortOption = { bidsCount: -1 };

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const [gigs, total] = await Promise.all([
      Gig.find(query)
        .populate('client', 'name avatar')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Gig.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      gigs,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalGigs: total,
        hasMore: pageNum * limitNum < total,
      },
    });
  } catch (error) {
    console.error('Get gigs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching gigs',
    });
  }
};

// @desc    Get single gig with bids
// @route   GET /api/gigs/:id
// @access  Public
export const getGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id)
      .populate('client', 'name avatar bio gigsPosted')
      .populate('assignedFreelancer', 'name avatar')
      .populate({
        path: 'assignedBid',
        populate: { path: 'freelancer', select: 'name avatar' },
      })
      .lean();

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found',
      });
    }

    // Get all bids for this gig
    const bids = await Bid.find({ gig: gig._id })
      .populate('freelancer', 'name avatar bio skills gigsCompleted')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      gig: { ...gig, bids },
    });
  } catch (error) {
    console.error('Get gig error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching gig details',
    });
  }
};

// @desc    Create new gig
// @route   POST /api/gigs
// @access  Private
export const createGig = async (req, res) => {
  try {
    const { title, description, budget, category, skills, deadline } = req.body;

    // Validate deadline is in the future
    const deadlineDate = new Date(deadline);
    if (deadlineDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Deadline must be in the future',
      });
    }

    const gig = await Gig.create({
      title,
      description,
      budget,
      category,
      skills: skills || [],
      deadline: deadlineDate,
      client: req.user._id,
    });

    // Update user's gigs posted count
    await User.findByIdAndUpdate(req.user._id, { $inc: { gigsPosted: 1 } });

    // Populate client info
    await gig.populate('client', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Gig posted successfully',
      gig,
    });
  } catch (error) {
    console.error('Create gig error:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages[0],
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating gig',
    });
  }
};

// @desc    Update gig
// @route   PUT /api/gigs/:id
// @access  Private (Owner only)
export const updateGig = async (req, res) => {
  try {
    let gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found',
      });
    }

    // Check ownership
    if (gig.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this gig',
      });
    }

    // Can only update open gigs
    if (gig.status !== 'open') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update a gig that is already assigned or completed',
      });
    }

    const { title, description, budget, category, skills, deadline } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (budget) updateData.budget = budget;
    if (category) updateData.category = category;
    if (skills) updateData.skills = skills;
    if (deadline) updateData.deadline = new Date(deadline);

    gig = await Gig.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate('client', 'name avatar');

    res.status(200).json({
      success: true,
      message: 'Gig updated successfully',
      gig,
    });
  } catch (error) {
    console.error('Update gig error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating gig',
    });
  }
};

// @desc    Delete gig
// @route   DELETE /api/gigs/:id
// @access  Private (Owner only)
export const deleteGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found',
      });
    }

    // Check ownership
    if (gig.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this gig',
      });
    }

    // Can only delete open gigs
    if (gig.status !== 'open') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete a gig that is already assigned',
      });
    }

    // Delete all related bids
    await Bid.deleteMany({ gig: gig._id });

    // Delete the gig
    await gig.deleteOne();

    // Update user's gigs posted count
    await User.findByIdAndUpdate(req.user._id, { $inc: { gigsPosted: -1 } });

    res.status(200).json({
      success: true,
      message: 'Gig deleted successfully',
    });
  } catch (error) {
    console.error('Delete gig error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting gig',
    });
  }
};

// @desc    Get user's posted gigs (Client view)
// @route   GET /api/gigs/my/posted
// @access  Private
export const getMyPostedGigs = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = { client: req.user._id };
    if (status && status !== 'all') {
      query.status = status;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [gigs, total] = await Promise.all([
      Gig.find(query)
        .populate('assignedFreelancer', 'name avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Gig.countDocuments(query),
    ]);

    // Get bids count for each gig
    const gigsWithBids = await Promise.all(
      gigs.map(async (gig) => {
        const bidsCount = await Bid.countDocuments({ gig: gig._id });
        return { ...gig, bidsCount };
      })
    );

    res.status(200).json({
      success: true,
      gigs: gigsWithBids,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalGigs: total,
      },
    });
  } catch (error) {
    console.error('Get my posted gigs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching your gigs',
    });
  }
};

// @desc    Mark gig as completed
// @route   PATCH /api/gigs/:id/complete
// @access  Private (Owner only)
export const completeGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found',
      });
    }

    // Check ownership
    if (gig.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    if (gig.status !== 'assigned') {
      return res.status(400).json({
        success: false,
        message: 'Only assigned gigs can be marked as completed',
      });
    }

    gig.status = 'completed';
    await gig.save();

    // Update freelancer stats
    if (gig.assignedFreelancer) {
      const hiredBid = await Bid.findOne({ gig: gig._id, status: 'hired' });
      await User.findByIdAndUpdate(gig.assignedFreelancer, {
        $inc: {
          gigsCompleted: 1,
          totalEarnings: hiredBid ? hiredBid.amount : gig.budget,
        },
      });
    }

    // Update client stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { totalSpent: gig.budget },
    });

    res.status(200).json({
      success: true,
      message: 'Gig marked as completed',
      gig,
    });
  } catch (error) {
    console.error('Complete gig error:', error);
    res.status(500).json({
      success: false,
      message: 'Error completing gig',
    });
  }
};
