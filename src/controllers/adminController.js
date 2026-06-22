// dish-drop-server/src/controllers/adminController.js
import User from '../models/User.js';
import Recipe from '../models/Recipe.js';
import Report from '../models/Report.js';
import Payment from '../models/Payment.js';

// ==================== GET ADMIN STATS ====================
export const getStats = async (req, res) => {
  try {
    const [totalUsers, totalRecipes, totalPremium, totalReports] = await Promise.all([
      User.countDocuments(),
      Recipe.countDocuments({ status: 'active' }),
      User.countDocuments({ isPremium: true }),
      Report.countDocuments({ status: 'pending' })
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalRecipes,
        totalPremium,
        totalReports
      }
    });

  } catch (error) {
    console.error('Get Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stats'
    });
  }
};

// ==================== GET ALL USERS ====================
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      users
    });

  } catch (error) {
    console.error('Get All Users Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
};

// ==================== BLOCK/UNBLOCK USER ====================
export const toggleUserBlock = async (req, res) => {
  try {
    const { id } = req.params;
    const { block } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent admin from blocking themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot block yourself'
      });
    }

    user.isBlocked = block;
    await user.save();

    res.status(200).json({
      success: true,
      message: block ? 'User blocked successfully' : 'User unblocked successfully',
      user
    });

  } catch (error) {
    console.error('Toggle User Block Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user status'
    });
  }
};

// ==================== GET ALL RECIPES (Admin) ====================
export const getAllRecipesAdmin = async (req, res) => {
  try {
    const recipes = await Recipe.find()
      .populate('authorId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      recipes
    });

  } catch (error) {
    console.error('Get All Recipes Admin Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recipes'
    });
  }
};

// ==================== DELETE RECIPE (Admin) ====================
export const deleteRecipeAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    // Soft delete - update status
    recipe.status = 'removed';
    await recipe.save();

    res.status(200).json({
      success: true,
      message: 'Recipe removed successfully'
    });

  } catch (error) {
    console.error('Delete Recipe Admin Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete recipe'
    });
  }
};

// ==================== TOGGLE FEATURED RECIPE ====================
export const toggleFeaturedRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const { featured } = req.body;

    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    recipe.isFeatured = featured;
    await recipe.save();

    res.status(200).json({
      success: true,
      message: featured ? 'Recipe featured successfully' : 'Recipe unfeatured successfully',
      recipe
    });

  } catch (error) {
    console.error('Toggle Featured Recipe Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update recipe'
    });
  }
};

// ==================== GET ALL REPORTS ====================
export const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('recipeId', 'recipeName recipeImage authorName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      reports
    });

  } catch (error) {
    console.error('Get All Reports Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reports'
    });
  }
};

// ==================== DISMISS REPORT ====================
export const dismissReport = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    report.status = 'dismissed';
    await report.save();

    res.status(200).json({
      success: true,
      message: 'Report dismissed successfully'
    });

  } catch (error) {
    console.error('Dismiss Report Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to dismiss report'
    });
  }
};

// ==================== REMOVE RECIPE FROM REPORT ====================
export const removeRecipeFromReport = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Update recipe status
    await Recipe.findByIdAndUpdate(report.recipeId, { status: 'removed' });

    // Update report status
    report.status = 'resolved';
    await report.save();

    res.status(200).json({
      success: true,
      message: 'Recipe removed and report resolved'
    });

  } catch (error) {
    console.error('Remove Recipe From Report Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove recipe'
    });
  }
};