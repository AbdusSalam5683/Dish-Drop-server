// dish-drop-server/src/routes/userRoutes.js
import express from 'express';
import { getUserStats, updateProfile, getRecentLikes } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// User routes
router.get('/stats', getUserStats);
router.get('/recent-likes', getRecentLikes);
router.put('/profile', updateProfile);

export default router;