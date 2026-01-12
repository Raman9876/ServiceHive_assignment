import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes - verify JWT from Authorization header OR HttpOnly cookie
export const protect = async (req, res, next) => {
  try {
    let token;

    // 1. First check Authorization header (Bearer token) - preferred for cross-origin
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // 2. Fallback to HttpOnly cookie (for same-origin or localhost)
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Please login to continue.',
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      const user = await User.findById(decoded.userId).select('-password');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found. Please login again.',
        });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Token is invalid or expired. Please login again.',
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during authentication',
    });
  }
};

// Generate JWT Token
export const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// Set token cookie
export const setTokenCookie = (res, token) => {
  // Determine if we are on localhost based on CLIENT_URL or NODE_ENV
  // If CLIENT_URL is set to localhost, or undefined but NODE_ENV is dev (and not on Render), assume local.
  // But for Render, we want to be aggressive about allowing Cross-Site.
  
  // We assume we are in "Production/Cloud" mode unless we explicitly see "localhost" in CLIENT_URL
  const clientUrl = process.env.CLIENT_URL || '';
  const isLocalhost = clientUrl.includes('localhost') || clientUrl.includes('127.0.0.1');

  const options = {
    httpOnly: true,
    // If not localhost, we force SafeSite: None + Secure to allow Vercel -> Render cookies
    secure: !isLocalhost, 
    sameSite: isLocalhost ? 'lax' : 'none',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  };

  res.cookie('token', token, options);
};

// Clear token cookie
export const clearTokenCookie = (res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
    secure: true,
    sameSite: 'none'
  });
};
