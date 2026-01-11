import express from 'express';
import {
  getGigs,
  getGig,
  createGig,
  updateGig,
  deleteGig,
  getMyPostedGigs,
  completeGig,
} from '../controllers/gigController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getGigs);

// Protected routes - specific paths BEFORE parameterized routes
router.get('/my/posted', protect, getMyPostedGigs);
router.post('/', protect, createGig);

// Parameterized routes AFTER specific paths
router.get('/:id', getGig);
router.put('/:id', protect, updateGig);
router.delete('/:id', protect, deleteGig);
router.patch('/:id/complete', protect, completeGig);

export default router;
