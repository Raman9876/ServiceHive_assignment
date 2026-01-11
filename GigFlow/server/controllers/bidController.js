import mongoose from 'mongoose';
import Gig from '../models/Gig.js';
import Bid from '../models/Bid.js';
import User from '../models/User.js';
import { emitHireNotification } from '../socket/socketHandler.js';

// @desc    Submit a bid on a gig
// @route   POST /api/bids
// @access  Private
export const createBid = async (req, res) => {
  try {
    const { gigId, amount, message, deliveryTime } = req.body;

    // Find the gig
    const gig = await Gig.findById(gigId);

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found',
      });
    }

    // Check if gig is open
    if (gig.status !== 'open') {
      return res.status(400).json({
        success: false,
        message: 'This gig is no longer accepting bids',
      });
    }

    // Can't bid on your own gig
    if (gig.client.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot bid on your own gig',
      });
    }

    // Check if user already bid on this gig
    const existingBid = await Bid.findOne({
      gig: gigId,
      freelancer: req.user._id,
    });

    if (existingBid) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a bid for this gig',
      });
    }

    // Create the bid
    const bid = await Bid.create({
      gig: gigId,
      freelancer: req.user._id,
      amount,
      message,
      deliveryTime,
    });

    // Update gig's bid count
    await Gig.findByIdAndUpdate(gigId, { $inc: { bidsCount: 1 } });

    // Populate freelancer info
    await bid.populate('freelancer', 'name avatar bio skills');

    // Emit a real-time new-bid notification to gig owner ONLY (single emission)
    try {
      const io = req.app.get('io');
      const payload = {
        type: 'new_bid',
        gigId: gigId.toString(),
        gigTitle: gig.title,
        amount: bid.amount,
        bid: {
          _id: bid._id,
          amount: bid.amount,
          message: bid.message,
          freelancer: {
            _id: req.user._id,
            name: req.user.name,
            avatar: req.user.avatar,
          },
        },
        timestamp: new Date().toISOString(),
      };

      if (io) {
        // Notify ONLY the gig owner (personal room) - single target prevents duplicates
        io.to(`user:${gig.client.toString()}`).emit('new_bid', payload);
      }
    } catch (err) {
      console.error('Error emitting new bid notification:', err.message);
    }

    res.status(201).json({
      success: true,
      message: 'Bid submitted successfully',
      bid,
    });
  } catch (error) {
    console.error('Create bid error:', error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a bid for this gig',
      });
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages[0],
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error submitting bid',
    });
  }
};

// @desc    Get bids for a gig
// @route   GET /api/bids/gig/:gigId
// @access  Public
export const getGigBids = async (req, res) => {
  try {
    const bids = await Bid.find({ gig: req.params.gigId })
      .populate('freelancer', 'name avatar bio skills gigsCompleted')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      bids,
    });
  } catch (error) {
    console.error('Get gig bids error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bids',
    });
  }
};

// @desc    Get user's bids (Freelancer view)
// @route   GET /api/bids/my
// @access  Private
export const getMyBids = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = { freelancer: req.user._id };
    if (status && status !== 'all') {
      query.status = status;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [bids, total] = await Promise.all([
      Bid.find(query)
        .populate({
          path: 'gig',
          select: 'title budget status category deadline client',
          populate: { path: 'client', select: 'name avatar' },
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Bid.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      bids,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalBids: total,
      },
    });
  } catch (error) {
    console.error('Get my bids error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching your bids',
    });
  }
};

// @desc    Withdraw a bid
// @route   DELETE /api/bids/:id
// @access  Private
export const withdrawBid = async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.id);

    if (!bid) {
      return res.status(404).json({
        success: false,
        message: 'Bid not found',
      });
    }

    // Check ownership
    if (bid.freelancer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to withdraw this bid',
      });
    }

    // Can only withdraw pending bids
    if (bid.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot withdraw a bid that has been processed',
      });
    }

    // Update gig's bid count
    await Gig.findByIdAndUpdate(bid.gig, { $inc: { bidsCount: -1 } });

    // Delete the bid
    await bid.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Bid withdrawn successfully',
    });
  } catch (error) {
    console.error('Withdraw bid error:', error);
    res.status(500).json({
      success: false,
      message: 'Error withdrawing bid',
    });
  }
};

// @desc    Hire a freelancer (CRITICAL - Uses MongoDB ACID Transactions)
// @route   PATCH /api/bids/:bidId/hire
// @access  Private (Gig owner only)
// @note    Implements optimistic concurrency control to prevent race conditions
//          during high-concurrency hiring events. Uses MongoDB Replica Set transactions.
export const hireBid = async (req, res) => {
  // Start a MongoDB session for ACID transaction
  const session = await mongoose.startSession();

  try {
    // Begin transaction with read concern "snapshot" for true isolation
    session.startTransaction({
      readConcern: { level: 'snapshot' },
      writeConcern: { w: 'majority' },
    });

    // Step 1: Find and validate the bid within transaction
    const bid = await Bid.findById(req.params.bidId)
      .populate('freelancer', 'name avatar socketId email')
      .session(session);

    if (!bid) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: 'Bid not found',
      });
    }

    // Step 2: Find gig with session (within transaction boundary)
    const gig = await Gig.findById(bid.gig)
      .populate('client', 'name email')
      .session(session);

    if (!gig) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: 'Gig not found',
      });
    }

    // Step 3: Authorization - Verify requester is the gig owner
    if (gig.client._id.toString() !== req.user._id.toString()) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({
        success: false,
        message: 'Only the gig owner can hire freelancers',
      });
    }

    // Step 4: CRITICAL RACE CONDITION CHECK
    // If another request already assigned this gig (concurrent hire attempt),
    // the transaction will detect this and abort
    if (gig.status !== 'open') {
      await session.abortTransaction();
      session.endSession();
      return res.status(409).json({
        success: false,
        message: 'Conflict: This gig has already been assigned to another freelancer',
        code: 'GIG_ALREADY_ASSIGNED',
      });
    }

    // Step 5: Verify bid is still pending
    if (bid.status !== 'pending') {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: 'This bid has already been processed',
      });
    }

    // Step 6: Update gig status to "assigned" (atomic operation)
    const updatedGig = await Gig.findByIdAndUpdate(
      gig._id,
      {
        status: 'assigned',
        assignedFreelancer: bid.freelancer._id,
        assignedBid: bid._id,
        assignedAt: new Date(),
      },
      { session, new: true }
    );

    // Step 7: Update selected bid status to "hired"
    const updatedBid = await Bid.findByIdAndUpdate(
      bid._id,
      { 
        status: 'hired',
        hiredAt: new Date(),
      },
      { session, new: true }
    );

    // Step 8: Reject ALL other pending bids for this gig atomically
    const rejectionResult = await Bid.updateMany(
      { 
        gig: gig._id, 
        _id: { $ne: bid._id },
        status: 'pending'
      },
      { 
        status: 'rejected',
        rejectedAt: new Date(),
      },
      { session }
    );

    // Step 9: Update freelancer's stats
    await User.findByIdAndUpdate(
      bid.freelancer._id,
      { $inc: { gigsWon: 1 } },
      { session }
    );

    // Step 10: Commit the transaction - all operations succeed or none do
    await session.commitTransaction();
    session.endSession();

    console.log(`✅ Transaction committed: Hired ${bid.freelancer.name} for "${gig.title}"`);
    console.log(`   └─ Rejected ${rejectionResult.modifiedCount} other bids`);

    // Prepare comprehensive notification data for socket emission
    const notificationData = {
      type: 'notification:hired',
      gigId: gig._id.toString(),
      gigTitle: gig.title,
      freelancerId: bid.freelancer._id.toString(),
      freelancerSocketId: bid.freelancer.socketId,
      freelancerName: bid.freelancer.name,
      clientName: gig.client.name,
      amount: bid.amount,
      message: `🎉 Congratulations! You've been hired for "${gig.title}"`,
      timestamp: new Date().toISOString(),
    };

    // Emit socket notification to the hired freelancer
    const io = req.app.get('io');
    if (io) {
      emitHireNotification(io, notificationData);
      console.log('📢 Socket notification emitted for hire');
    }

    // Return success response with notification data for socket emission
    res.status(200).json({
      success: true,
      message: `Successfully hired ${bid.freelancer.name}`,
      notificationData,
      bid: {
        ...bid.toObject(),
        status: 'hired',
        hiredAt: new Date(),
      },
      gig: {
        _id: gig._id,
        status: 'assigned',
        assignedFreelancer: bid.freelancer,
      },
    });
  } catch (error) {
    // CRITICAL: Abort transaction on any error to maintain data integrity
    await session.abortTransaction();
    session.endSession();

    // Handle specific MongoDB transaction errors
    if (error.code === 112 || error.codeName === 'WriteConflict') {
      // Write conflict - another transaction modified the same document
      console.error('⚠️ Write conflict detected - concurrent hire attempt');
      return res.status(409).json({
        success: false,
        message: 'Another hire operation is in progress. Please try again.',
        code: 'WRITE_CONFLICT',
      });
    }

    if (error.code === 251 || error.codeName === 'TransactionAborted') {
      console.error('⚠️ Transaction aborted by the server');
      return res.status(500).json({
        success: false,
        message: 'Transaction was aborted. Please retry.',
        code: 'TRANSACTION_ABORTED',
      });
    }

    console.error('❌ Hire bid transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing hire request. Please try again.',
      code: 'INTERNAL_ERROR',
    });
  }
};

// @desc    Get bid statistics for dashboard
// @route   GET /api/bids/stats
// @access  Private
export const getBidStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const [
      totalBids,
      pendingBids,
      hiredBids,
      rejectedBids,
      totalPostedGigs,
      openGigs,
      assignedGigs,
      completedGigs,
    ] = await Promise.all([
      Bid.countDocuments({ freelancer: userId }),
      Bid.countDocuments({ freelancer: userId, status: 'pending' }),
      Bid.countDocuments({ freelancer: userId, status: 'hired' }),
      Bid.countDocuments({ freelancer: userId, status: 'rejected' }),
      Gig.countDocuments({ client: userId }),
      Gig.countDocuments({ client: userId, status: 'open' }),
      Gig.countDocuments({ client: userId, status: 'assigned' }),
      Gig.countDocuments({ client: userId, status: 'completed' }),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        freelancer: {
          totalBids,
          pendingBids,
          hiredBids,
          rejectedBids,
          successRate: totalBids > 0 ? ((hiredBids / totalBids) * 100).toFixed(1) : 0,
        },
        client: {
          totalPostedGigs,
          openGigs,
          assignedGigs,
          completedGigs,
        },
      },
    });
  } catch (error) {
    console.error('Get bid stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
    });
  }
};
