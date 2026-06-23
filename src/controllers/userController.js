// dish-drop-server/src/controllers/userController.js
import User from '../models/User.js';
import Recipe from '../models/Recipe.js';
import Favorite from '../models/Favorite.js';

// ==================== GET USER STATS ====================
export const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const [totalRecipes, totalFavorites, totalLikesReceived] = await Promise.all([
      Recipe.countDocuments({ authorId: userId, status: 'active' }),
      Favorite.countDocuments({ userId }),
      Recipe.aggregate([
        { $match: { authorId: userId, status: 'active' } },
        { $group: { _id: null, total: { $sum: '$likesCount' } } }
      ])
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalRecipes,
        totalFavorites,
        totalLikesReceived: totalLikesReceived[0]?.total || 0,
        totalPurchased: 0 // Will be implemented with payment system
      }
    });

  } catch (error) {
    console.error('Get User Stats Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch stats'
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
    console.error('Update Profile Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update profile'
    });
  }
};