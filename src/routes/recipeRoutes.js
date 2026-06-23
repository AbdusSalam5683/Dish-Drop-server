// dish-drop-server/src/routes/recipeRoutes.js
import express from 'express';
import {
  getAllRecipes,
  getFeaturedRecipes,
  getPopularRecipes,
  getRecipeById,
  createRecipe,
  getMyRecipes,
  updateRecipe,
  deleteRecipe,
  toggleLike
} from '../controllers/recipeController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// ==================== PUBLIC ROUTES ====================
router.get('/', getAllRecipes);
router.get('/featured', getFeaturedRecipes);
router.get('/popular', getPopularRecipes);

// ==================== PROTECTED ROUTES (SPECIFIC FIRST) ====================
// 👇 IMPORTANT: /my-recipes MUST come before /:id
router.get('/my-recipes', protect, getMyRecipes);

// ==================== PUBLIC ROUTES WITH PARAMS (LAST) ====================
router.get('/:id', getRecipeById);

// ==================== PROTECTED ROUTES ====================
router.post('/', protect, createRecipe);
router.put('/:id', protect, updateRecipe);
router.delete('/:id', protect, deleteRecipe);
router.put('/:id/like', protect, toggleLike);

export default router;