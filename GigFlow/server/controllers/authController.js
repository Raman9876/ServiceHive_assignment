import User from '../models/User.js';
import {
  generateToken,
  setTokenCookie,
  clearTokenCookie,
} from '../middleware/auth.js';

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
    });

    // Generate token and set cookie
    const token = generateToken(user._id);
    setTokenCookie(res, token);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        skills: user.skills,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Register error:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages[0],
      });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating account. Please try again.',
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Find user and include password for comparison
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+password'
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate token and set cookie
    const token = generateToken(user._id);
    setTokenCookie(res, token);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        skills: user.skills,
        totalEarnings: user.totalEarnings,
        totalSpent: user.totalSpent,
        gigsPosted: user.gigsPosted,
        gigsCompleted: user.gigsCompleted,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in. Please try again.',
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
  try {
    // Update user online status
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, {
        isOnline: false,
        socketId: null,
      });
    }

    clearTokenCookie(res);

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging out',
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user data',
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name, bio, skills, location, website } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (skills) updateData.skills = skills;
    if (location !== undefined) updateData.location = location;
    if (website !== undefined) updateData.website = website;

    // Update avatar if name changed
    if (name) {
      updateData.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name
      )}&background=3b82f6&color=fff&size=128`;
    }

    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
    });
  }
};

// @desc    Check auth status
// @route   GET /api/auth/check
// @access  Public
export const checkAuth = async (req, res) => {
  try {
    if (!req.cookies || !req.cookies.token) {
      return res.status(200).json({
        success: true,
        isAuthenticated: false,
        user: null,
      });
    }

    // Token exists, try to verify (handled by middleware if needed)
    res.status(200).json({
      success: true,
      isAuthenticated: true,
      user: req.user || null,
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      isAuthenticated: false,
      user: null,
    });
  }
};

// @desc    Google OAuth - Sign in/up with Google
// @route   POST /api/auth/google
// @access  Public
export const googleAuth = async (req, res) => {
  try {
    const { email, name, picture, googleId } = req.body;

    if (!email || !name) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Google authentication data',
      });
    }

    // Check if user already exists
    let user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      // User exists - log them in
      // Update avatar to Google picture if they don't have a custom one
      if (picture && user.avatar?.includes('ui-avatars.com')) {
        user.avatar = picture;
        await user.save();
      }
    } else {
      // User doesn't exist - create new account
      // Generate a random secure password (user won't need it, they'll use Google)
      const randomPassword = Math.random().toString(36).slice(-12) + 
                            Math.random().toString(36).slice(-12) + 
                            '!Aa1';

      user = await User.create({
        name,
        email: email.toLowerCase(),
        password: randomPassword,
        avatar: picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&size=128`,
        googleId,
      });
    }

    // Generate token and set HttpOnly cookie (same as regular login)
    const token = generateToken(user._id);
    setTokenCookie(res, token);

    res.status(200).json({
      success: true,
      message: user.createdAt === user.updatedAt ? 'Account created successfully' : 'Login successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        skills: user.skills,
        totalEarnings: user.totalEarnings,
        totalSpent: user.totalSpent,
        gigsPosted: user.gigsPosted,
        gigsCompleted: user.gigsCompleted,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Google auth error:', error);

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error with Google authentication. Please try again.',
    });
  }
};
