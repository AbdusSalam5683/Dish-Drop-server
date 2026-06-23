// dish-drop-server/src/controllers/favoriteController.js
import Favorite from '../models/Favorite.js';
import Recipe from '../models/Recipe.js';

// ==================== ADD TO FAVORITES ====================
export const addToFavorites = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const userId = req.user.id;

    // Check if recipe exists
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    // Check if already in favorites
    const existing = await Favorite.findOne({ userId, recipeId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Recipe already in favorites'
      });
    }

    const favorite = await Favorite.create({
      userId,
      recipeId,
      userEmail: req.user.email
    });

    res.status(201).json({
      success: true,
      message: 'Added to favorites',
      favorite
    });

  } catch (error) {
    console.error('Add to Favorites Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to add to favorites'
    });
  }
};

// ==================== REMOVE FROM FAVORITES ====================
export const removeFromFavorites = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const userId = req.user.id;

    const favorite = await Favorite.findOneAndDelete({ userId, recipeId });
    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found in favorites'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Removed from favorites'
    });

  } catch (error) {
    console.error('Remove from Favorites Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to remove from favorites'
    });
  }
};

// ==================== GET USER FAVORITES ====================
export const getMyFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.user.id })
      .populate('recipeId')
      .sort({ createdAt: -1 });

    // Filter out deleted recipes
    const validFavorites = favorites.filter(f => f.recipeId !== null);

    res.status(200).json({
      success: true,
      favorites: validFavorites
    });

  } catch (error) {
    console.error('Get Favorites Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch favorites'
    });
  }
};

// ==================== CHECK IF FAVORITE ====================
export const isFavorite = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const userId = req.user.id;

    const favorite = await Favorite.findOne({ userId, recipeId });

    res.status(200).json({
      success: true,
      isFavorite: !!favorite
    });

  } catch (error) {
    console.error('Check Favorite Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to check favorite'
    });
  }
};