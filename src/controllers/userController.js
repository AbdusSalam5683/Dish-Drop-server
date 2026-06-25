// dish-drop-server/src/controllers/userController.js
import User from '../models/User.js';
import Recipe from '../models/Recipe.js';
import Favorite from '../models/Favorite.js';
import Payment from '../models/Payment.js';

// ==================== GET USER STATS ====================
export const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Count total recipes
    const totalRecipes = await Recipe.countDocuments({ 
      authorId: userId, 
      status: 'active' 
    });

    // Count total favorites
    const totalFavorites = await Favorite.countDocuments({ userId });

    // ✅ FIX: Manually calculate total likes from user's recipes
    const userRecipes = await Recipe.find({ 
      authorId: userId, 
      status: 'active' 
    }).select('likesCount');
    
    let totalLikesReceived = 0;
    userRecipes.forEach(recipe => {
      totalLikesReceived += recipe.likesCount || 0;
    });

    console.log('📊 Manual like sum:', totalLikesReceived);
    console.log('📊 User recipes count:', userRecipes.length);

    // Count purchased recipes (from Payment model)
    const totalPurchased = await Payment.countDocuments({
      userId: userId,
      paymentStatus: 'completed'
    });

    console.log('📊 Stats for user:', userId);
    console.log('📝 Total Recipes:', totalRecipes);
    console.log('⭐ Total Favorites:', totalFavorites);
    console.log('❤️ Total Likes Received:', totalLikesReceived);
    console.log('🛒 Total Purchased:', totalPurchased);

    res.status(200).json({
      success: true,
      stats: {
        totalRecipes,
        totalFavorites,
        totalLikesReceived,
        totalPurchased
      }
    });

  } catch (error) {
    console.error('❌ Get User Stats Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch stats'
    });
  }
};

// ==================== GET RECENT LIKES ====================
export const getRecentLikes = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all recipes by this user
    const recipes = await Recipe.find({ 
      authorId: userId, 
      status: 'active' 
    }).select('_id recipeName recipeImage likesCount likedBy updatedAt');

    // Get recent likes (users who liked this author's recipes)
    const recentLikes = [];
    
    for (const recipe of recipes) {
      if (recipe.likedBy && recipe.likedBy.length > 0) {
        // Get user details for each liker
        const likers = await User.find({
          _id: { $in: recipe.likedBy }
        }).select('name email image');
        
        likers.forEach(liker => {
          recentLikes.push({
            recipeId: recipe._id,
            recipeName: recipe.recipeName,
            recipeImage: recipe.recipeImage,
            likerName: liker.name,
            likerImage: liker.image,
            likerEmail: liker.email,
            likedAt: recipe.updatedAt || new Date()
          });
        });
      }
    }

    // Sort by most recent and limit to 10
    recentLikes.sort((a, b) => new Date(b.likedAt) - new Date(a.likedAt));
    const limitedLikes = recentLikes.slice(0, 10);

    console.log(`📊 Recent likes for user ${userId}: ${limitedLikes.length} entries`);

    res.status(200).json({
      success: true,
      likes: limitedLikes
    });

  } catch (error) {
    console.error('❌ Get Recent Likes Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch recent likes'
    });
  }
};

// ==================== UPDATE PROFILE ====================
export const updateProfile = async (req, res) => {
  try {
    const { name, image } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (name) user.name = name;
    if (image) user.image = image;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user
    });

  } catch (error) {
    console.error('❌ Update Profile Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update profile'
    });
  }
};