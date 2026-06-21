// dish-drop-server/src/routes/authRoutes.js
import express from 'express';
import { 
  register, 
  login, 
  logout, 
  getCurrentUser 
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);   // this route 
router.post('/login', login);
router.post('/logout', logout);

// Protected routes
router.get('/me', protect, getCurrentUser);

export default router;