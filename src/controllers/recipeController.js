// dish-drop-server/src/controllers/recipeController.js
import Recipe from '../models/Recipe.js';

// ==================== GET ALL RECIPES ====================
export const getAllRecipes = async (req, res) => {
  try {
    const { page = 1, limit = 9, category, cuisine, search } = req.query;
    
    const query = { status: 'active' };
    
    // Category filter
    if (category) query.category = category;
    
    // Cuisine filter
    if (cuisine) query.cuisineType = cuisine;
    
    // Search filter - recipe name, cuisine type, or category
    if (search) {
      query.$or = [
        { recipeName: { $regex: search, $options: 'i' } },
        { cuisineType: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [recipes, total] = await Promise.all([
      Recipe.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('authorId', 'name email image'),
      Recipe.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      recipes,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get All Recipes Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch recipes'
    });
  }
};

// ==================== GET FEATURED RECIPES ====================
export const getFeaturedRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ 
      isFeatured: true, 
      status: 'active' 
    })
    .limit(6)
    .populate('authorId', 'name email image');

    res.status(200).json({
      success: true,
      recipes
    });

  } catch (error) {
    console.error('Get Featured Recipes Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch featured recipes'
    });
  }
};

// ==================== GET POPULAR RECIPES ====================
export const getPopularRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ status: 'active' })
      .sort({ likesCount: -1 })
      .limit(4)
      .populate('authorId', 'name email image');

    res.status(200).json({
      success: true,
      recipes
    });

  } catch (error) {
    console.error('Get Popular Recipes Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch popular recipes'
    });
  }
};

// ==================== GET SINGLE RECIPE ====================
export const getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const recipe = await Recipe.findById(id)
      .populate('authorId', 'name email image isPremium');

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    res.status(200).json({
      success: true,
      recipe
    });

  } catch (error) {
    console.error('Get Recipe By ID Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch recipe'
    });
  }
};