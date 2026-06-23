// dish-drop-server/src/routes/reportRoutes.js
import express from 'express';
import { createReport } from '../controllers/reportController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// ==================== PROTECTED ROUTES ====================
router.post('/', protect, createReport);

export default router;