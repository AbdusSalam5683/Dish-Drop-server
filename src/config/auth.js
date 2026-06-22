// dish-drop-server/src/config/auth.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// JWT Configuration
export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
export const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

// Generate JWT Token
export const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      email: user.email,
      role: user.role || 'user'
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  );
};

// Verify JWT Token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Generate Refresh Token (optional)
export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// ==================== GOOGLE OAUTH HELPERS ====================
// Google OAuth configuration
export const googleAuthConfig = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: `${process.env.SERVER_URL || 'http://localhost:5000'}/api/auth/google/callback`,
  scope: 'email profile',
};

// Get Google OAuth URL
export const getGoogleAuthURL = () => {
  const { clientId, redirectUri, scope } = googleAuthConfig;
  return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
};

// Exchange code for tokens
export const getGoogleTokens = async (code) => {
  const { clientId, clientSecret, redirectUri } = googleAuthConfig;
  
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });
  
  return response.json();
};

// Get Google user info
export const getGoogleUser = async (accessToken) => {
  const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  
  return response.json();
};