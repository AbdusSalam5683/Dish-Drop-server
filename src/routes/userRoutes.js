// dish-drop-server/src/routes/userRoutes.js
import express from 'express';
import { getUserStats, updateProfile } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/stats', getUserStats);
router.put('/profile', updateProfile);

export default router;