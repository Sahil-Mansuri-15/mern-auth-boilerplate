import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route: User Registration
router.post('/register', registerUser);

// Public route: User Login
router.post('/login', loginUser);

// Private route: Retrieve current user profile
router.get('/me', protect, getUserProfile);

export default router;
