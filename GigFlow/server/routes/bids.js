import express from 'express';
import {
  createBid,
  getGigBids,
  getMyBids,
  withdrawBid,
  hireBid,
  getBidStats,
} from '../controllers/bidController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All bid routes are protected
router.use(protect);

router.post('/', createBid);
router.get('/my', getMyBids);
router.get('/stats', getBidStats);
router.get('/gig/:gigId', getGigBids);
router.delete('/:id', withdrawBid);
router.patch('/:bidId/hire', hireBid);

export default router;
