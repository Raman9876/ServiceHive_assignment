import express from 'express';
import {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  checkAuth,
  googleAuth,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.get('/check', checkAuth);

// Protected routes
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

export default router;
