// dish-drop-server/src/routes/authRoutes.js
import express from 'express';
import { 
  register, 
  login, 
  logout, 
  getCurrentUser 
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { 
  getGoogleAuthURL, 
  getGoogleTokens, 
  getGoogleUser,
  generateToken 
} from '../config/auth.js';
import User from '../models/User.js';

const router = express.Router();

// ==================== PUBLIC ROUTES ====================
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// ==================== GOOGLE OAUTH ROUTES ====================
router.get('/google', (req, res) => {
  const authURL = getGoogleAuthURL();
  res.redirect(authURL);
});

router.get('/google/callback', async (req, res) => {
  const { code } = req.query;
  
  if (!code) {
    return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/login?error=no_code`);
  }

  try {
    const tokens = await getGoogleTokens(code);
    
    if (!tokens.access_token) {
      throw new Error('Failed to get access token');
    }

    const googleUser = await getGoogleUser(tokens.access_token);
    
    if (!googleUser.email) {
      throw new Error('Failed to get user email');
    }

    // Check if user exists
    let user = await User.findOne({ email: googleUser.email });
    
    if (!user) {
      user = await User.create({
        name: googleUser.name || googleUser.email.split('@')[0],
        email: googleUser.email,
        googleId: googleUser.id,
        image: googleUser.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(googleUser.name || googleUser.email)}&background=D85A30&color=fff&size=128`,
        role: 'user',
        isBlocked: false,
        isPremium: false,
        password: 'google_oauth_' + Math.random().toString(36).substring(2, 15)
      });
      console.log('✅ New Google user created:', user.email);
    } else {
      if (googleUser.picture && user.image !== googleUser.picture) {
        user.image = googleUser.picture;
        await user.save();
      }
      console.log('✅ Existing user logged in:', user.email);
    }

    if (user.isBlocked) {
      return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/login?error=blocked`);
    }

    // Generate JWT token
    const token = generateToken(user);
    
    // Set cookie with proper options
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/', // 👈 গুরুত্বপূর্ণ!
    });

    // 👇 Redirect to dashboard with token in URL (for client to store)
    const redirectUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/dashboard?token=${token}`;
    res.redirect(redirectUrl);

  } catch (error) {
    console.error('Google callback error:', error);
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/login?error=google_auth_failed`);
  }
});

// ==================== PROTECTED ROUTES ====================
router.get('/me', protect, getCurrentUser);

export default router;