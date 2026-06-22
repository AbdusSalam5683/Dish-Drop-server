// dish-drop-server/src/routes/recipeRoutes.js
import express from 'express';
import {
  getAllRecipes,
  getFeaturedRecipes,
  getPopularRecipes,
  getRecipeById
} from '../controllers/recipeController.js';

const router = express.Router();

// Public routes - সবাই দেখতে পারে
router.get('/', getAllRecipes);
router.get('/featured', getFeaturedRecipes);
router.get('/popular', getPopularRecipes);
router.get('/:id', getRecipeById);

export default router;