// dish-drop-server/src/routes/favoriteRoutes.js
import express from 'express';
import {
  addToFavorites,
  removeFromFavorites,
  getMyFavorites,
  isFavorite
} from '../controllers/favoriteController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/', getMyFavorites);
router.post('/:recipeId', addToFavorites);
router.delete('/:recipeId', removeFromFavorites);
router.get('/:recipeId/check', isFavorite);

export default router;