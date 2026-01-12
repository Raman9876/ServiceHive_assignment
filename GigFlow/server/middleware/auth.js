import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes - verify JWT from HttpOnly cookie
export const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from HttpOnly cookie
    if (req.cookies && req.cookies.token) {
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
  // Check if we are in production OR if we are on Render (by checking existence of a Render-specific env var like RENDER or just forcing it)
  // The logs showed NODE_ENV was 'development' on Render, which breaks the 'none' sameSite policy needed for cross-site cookies.
  
  const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true' || process.env.ON_RENDER === 'true';

  const options = {
    httpOnly: true,
    // Cross-site cookies (Vercel -> Render) MUST be Secure and SameSite: None
    // We will force this if we are not on localhost.
    secure: isProduction || true, // Always secure for now to ensure it works on Render
    sameSite: 'none',            // Always 'none' to allow cross-site (required for Vercel -> Render)
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  };
  
  // Note: For SameSite: None to work, Secure MUST be true.
  // This means on localhost (http), this might fail if not careful.
  // But we mostly care about the Production fix right now.
  if (process.env.NODE_ENV === 'development' && !isProduction) {
     // Localhost fallback
     options.secure = false;
     options.sameSite = 'lax';
  } else {
     // Force for Render
     options.secure = true;
     options.sameSite = 'none';
  }

  res.cookie('token', token, options);
};

// Clear token cookie
export const clearTokenCookie = (res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });
};
