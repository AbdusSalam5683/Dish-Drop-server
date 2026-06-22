// dish-drop-server/src/routes/adminRoutes.js
import express from 'express';
import { protect } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';
import {
  getStats,
  getAllUsers,
  toggleUserBlock,
  getAllRecipesAdmin,
  deleteRecipeAdmin,
  toggleFeaturedRecipe,
  getAllReports,
  dismissReport,
  removeRecipeFromReport
} from '../controllers/adminController.js';

const router = express.Router();

// All admin routes are protected and require admin role
router.use(protect, admin);

// Stats
router.get('/stats', getStats);

// Users
router.get('/users', getAllUsers);
router.put('/users/:id/block', toggleUserBlock);

// Recipes
router.get('/recipes', getAllRecipesAdmin);
router.delete('/recipes/:id', deleteRecipeAdmin);
router.put('/recipes/:id/feature', toggleFeaturedRecipe);

// Reports
router.get('/reports', getAllReports);
router.put('/reports/:id/dismiss', dismissReport);
router.put('/reports/:id/remove', removeRecipeFromReport);

export default router;