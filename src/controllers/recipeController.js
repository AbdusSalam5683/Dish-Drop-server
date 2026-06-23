// dish-drop-server/src/controllers/recipeController.js
import Recipe from '../models/Recipe.js';
import User from '../models/User.js';

// ==================== GET ALL RECIPES ====================
export const getAllRecipes = async (req, res) => {
  try {
    const { page = 1, limit = 9, category, cuisine, search } = req.query;
    
    const query = { status: 'active' };
    if (category) query.category = category;
    if (cuisine) query.cuisineType = cuisine;
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

// ==================== CREATE RECIPE ====================
export const createRecipe = async (req, res) => {
  try {
    console.log('📝 Create recipe request body:', req.body);

    const {
      recipeName,
      recipeImage,
      category,
      cuisineType,
      difficultyLevel,
      preparationTime,
      ingredients,
      instructions
    } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Free users can add only 2 recipes
    if (!user.isPremium) {
      const recipeCount = await Recipe.countDocuments({ authorId: user._id });
      if (recipeCount >= 2) {
        return res.status(403).json({
          success: false,
          message: 'Free users can add only 2 recipes. Upgrade to premium for unlimited recipes!'
        });
      }
    }

    let processedIngredients = [];
    let processedInstructions = [];

    if (Array.isArray(ingredients)) {
      processedIngredients = ingredients.filter(item => item && item.trim() !== '');
    } else if (typeof ingredients === 'string') {
      processedIngredients = ingredients.split(',').map(i => i.trim()).filter(i => i);
    }

    if (Array.isArray(instructions)) {
      processedInstructions = instructions.filter(item => item && item.trim() !== '');
    } else if (typeof instructions === 'string') {
      processedInstructions = instructions.split('\n').filter(i => i.trim());
    }

    if (processedIngredients.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please add at least one ingredient'
      });
    }

    if (processedInstructions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please add at least one instruction step'
      });
    }

    const recipe = await Recipe.create({
      recipeName,
      recipeImage,
      category,
      cuisineType,
      difficultyLevel,
      preparationTime,
      ingredients: processedIngredients,
      instructions: processedInstructions,
      authorId: user._id,
      authorName: user.name,
      authorEmail: user.email,
      likesCount: 0,
      likedBy: [], // 👇 Initialize empty array
      isFeatured: false,
      status: 'active'
    });

    await User.findByIdAndUpdate(user._id, { $inc: { recipeCount: 1 } });

    console.log('✅ Recipe created successfully:', recipe._id);

    res.status(201).json({
      success: true,
      message: 'Recipe created successfully',
      recipe
    });

  } catch (error) {
    console.error('❌ Create Recipe Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create recipe'
    });
  }
};

// ==================== GET USER'S RECIPES ====================
export const getMyRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ 
      authorId: req.user.id,
      status: { $ne: 'removed' }
    })
    .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      recipes
    });

  } catch (error) {
    console.error('Get My Recipes Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch recipes'
    });
  }
};

// ==================== UPDATE RECIPE ====================
export const updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      recipeName,
      recipeImage,
      category,
      cuisineType,
      difficultyLevel,
      preparationTime,
      ingredients,
      instructions
    } = req.body;

    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    if (recipe.authorId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this recipe'
      });
    }

    recipe.recipeName = recipeName || recipe.recipeName;
    recipe.recipeImage = recipeImage || recipe.recipeImage;
    recipe.category = category || recipe.category;
    recipe.cuisineType = cuisineType || recipe.cuisineType;
    recipe.difficultyLevel = difficultyLevel || recipe.difficultyLevel;
    recipe.preparationTime = preparationTime || recipe.preparationTime;
    
    if (ingredients) {
      if (Array.isArray(ingredients)) {
        recipe.ingredients = ingredients.filter(item => item && item.trim() !== '');
      } else if (typeof ingredients === 'string') {
        recipe.ingredients = ingredients.split(',').map(i => i.trim()).filter(i => i);
      }
    }
    
    if (instructions) {
      if (Array.isArray(instructions)) {
        recipe.instructions = instructions.filter(item => item && item.trim() !== '');
      } else if (typeof instructions === 'string') {
        recipe.instructions = instructions.split('\n').filter(i => i.trim());
      }
    }

    await recipe.save();

    res.status(200).json({
      success: true,
      message: 'Recipe updated successfully',
      recipe
    });

  } catch (error) {
    console.error('Update Recipe Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update recipe'
    });
  }
};

// ==================== DELETE RECIPE ====================
export const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    if (recipe.authorId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this recipe'
      });
    }

    recipe.status = 'removed';
    await recipe.save();

    await User.findByIdAndUpdate(req.user.id, { $inc: { recipeCount: -1 } });

    res.status(200).json({
      success: true,
      message: 'Recipe deleted successfully'
    });

  } catch (error) {
    console.error('Delete Recipe Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete recipe'
    });
  }
};

// ==================== LIKE/UNLIKE RECIPE ====================
export const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    console.log('🔍 Toggle like for recipe:', id);
    console.log('👤 User:', userId);

    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    // Check if user already liked
    const userLiked = recipe.likedBy?.includes(userId);
    console.log('📊 User liked before:', userLiked);
    console.log('📊 Current likesCount:', recipe.likesCount);
    console.log('📊 likedBy array length:', recipe.likedBy?.length || 0);

    if (userLiked) {
      // Unlike
      recipe.likesCount = Math.max(0, recipe.likesCount - 1);
      recipe.likedBy = recipe.likedBy.filter(
        uid => uid.toString() !== userId
      );
      console.log('👎 Unliked recipe');
    } else {
      // Like
      recipe.likesCount = (recipe.likesCount || 0) + 1;
      recipe.likedBy = [...(recipe.likedBy || []), userId];
      console.log('👍 Liked recipe');
    }

    await recipe.save();

    console.log('📊 New likesCount:', recipe.likesCount);
    console.log('📊 New likedBy length:', recipe.likedBy?.length || 0);

    res.status(200).json({
      success: true,
      message: userLiked ? 'Unliked recipe' : 'Liked recipe',
      likesCount: recipe.likesCount,
      isLiked: !userLiked
    });

  } catch (error) {
    console.error('❌ Toggle Like Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to toggle like'
    });
  }
};