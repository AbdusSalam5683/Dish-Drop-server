// dish-drop-server/src/middleware/admin.js
import { verifyToken } from '../config/auth.js';
import User from '../models/User.js';

// ==================== ADMIN MIDDLEWARE ====================
export const admin = async (req, res, next) => {
  try {
    // First check if user exists (from protect middleware)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    next();
  } catch (error) {
    console.error('Admin Middleware Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// ==================== CHECK ADMIN STATUS ====================
export const checkAdmin = async (req, res, next) => {
  try {
    if (req.user && req.user.role === 'admin') {
      req.isAdmin = true;
    } else {
      req.isAdmin = false;
    }
    next();
  } catch (error) {
    req.isAdmin = false;
    next();
  }
};