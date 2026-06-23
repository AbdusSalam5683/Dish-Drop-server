// dish-drop-server/src/controllers/reportController.js
import Report from '../models/Report.js';
import Recipe from '../models/Recipe.js';

// ==================== CREATE REPORT ====================
export const createReport = async (req, res) => {
  try {
    const { recipeId, reason } = req.body;
    const reporterEmail = req.user.email;

    // Check if recipe exists
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    // Check if already reported
    const existingReport = await Report.findOne({
      recipeId,
      reporterEmail,
      status: 'pending'
    });

    if (existingReport) {
      return res.status(400).json({
        success: false,
        message: 'You have already reported this recipe'
      });
    }

    const report = await Report.create({
      recipeId,
      reporterEmail,
      reason
    });

    res.status(201).json({
      success: true,
      message: 'Report submitted successfully',
      report
    });

  } catch (error) {
    console.error('Create Report Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit report'
    });
  }
};