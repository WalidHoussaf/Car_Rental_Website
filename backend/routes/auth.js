import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import RefreshToken from '../models/RefreshToken.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateUserRegistration, validateUserLogin, handleValidationErrors } from '../middleware/validation.js';
import { sendVerificationEmail, sendVerificationSuccessEmail } from '../services/emailService.js';

const router = express.Router();

// Generate access token (short-lived)
const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m'
  });
};

// Set authentication cookies
const setAuthCookies = (res, accessToken, refreshToken) => {
  // Access token cookie (15 minutes)
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000
  });

  // Refresh token cookie (7 days)
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 
  });
};

// Clear authentication cookies
const clearAuthCookies = (res) => {
  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
};

// Get client IP address
const getClientIp = (req) => {
  return req.headers['x-forwarded-for']?.split(',')[0] || 
         req.headers['x-real-ip'] || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress || 
         'unknown';
};

// Register new user
router.post('/register', validateUserRegistration, handleValidationErrors, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      dateOfBirth,
      address
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }



    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      phone,
      dateOfBirth,
      address
    });

    // Generate email verification token
    const verificationToken = user.generateVerificationToken();
    await user.save();

    // Send verification email
    try {
      await sendVerificationEmail(email, firstName, verificationToken);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Continue with registration even if email fails
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = await RefreshToken.createToken(user._id, getClientIp(req));

    // Set httpOnly cookies
    setAuthCookies(res, accessToken, refreshToken.token);

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please check your email to verify your account.',
      data: {
        user,
        emailSent: true
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
});

// Login user
router.post('/login', validateUserLogin, handleValidationErrors, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email (include password, loginAttempts, and lockUntil)
    const user = await User.findOne({ email }).select('+password +loginAttempts +lockUntil');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if account is locked
    if (user.isLocked) {
      const remainingTime = user.getLockTimeRemaining();
      await user.incLoginAttempts(); // Still count the attempt
      return res.status(423).json({
        success: false,
        message: `Account is temporarily locked due to multiple failed login attempts. Please try again in ${remainingTime} minutes.`,
        lockTimeRemaining: remainingTime
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      // Increment login attempts on failed password
      await user.incLoginAttempts();
      
      // Reload user to get updated loginAttempts and lockUntil
      const updatedUser = await User.findById(user._id).select('+loginAttempts +lockUntil');
      
      // Check if account just got locked
      if (updatedUser.isLocked) {
        const remainingTime = updatedUser.getLockTimeRemaining();
        return res.status(423).json({
          success: false,
          message: `Too many failed login attempts. Account is locked for ${remainingTime} minutes.`,
          lockTimeRemaining: remainingTime
        });
      }
      
      // Calculate remaining attempts
      const attemptsLeft = 5 - updatedUser.loginAttempts;
      return res.status(401).json({
        success: false,
        message: attemptsLeft > 0 
          ? `Invalid email or password. ${attemptsLeft} attempt(s) remaining before account lockout.`
          : 'Invalid email or password',
        attemptsRemaining: attemptsLeft
      });
    }

    // Successful login - reset login attempts
    if (user.loginAttempts > 0 || user.lockUntil) {
      await user.resetLoginAttempts();
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = await RefreshToken.createToken(user._id, getClientIp(req));

    // Set httpOnly cookies
    setAuthCookies(res, accessToken, refreshToken.token);

    // Remove sensitive fields from response
    user.password = undefined;
    user.loginAttempts = undefined;
    user.lockUntil = undefined;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        user: req.user
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const allowedUpdates = ['firstName', 'lastName', 'phone', 'address'];
    const updates = {};

    // Only allow specific fields to be updated
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
});

// Verify token endpoint
router.get('/verify', authenticateToken, async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Token is valid',
    data: {
      user: req.user
    }
  });
});

// Refresh access token
router.post('/refresh-token', async (req, res) => {
  try {
    // Get refresh token from cookie instead of body
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    // Find the refresh token in database
    const tokenDoc = await RefreshToken.findOne({ token: refreshToken }).populate('user');

    if (!tokenDoc) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Check if token is active (not revoked and not expired)
    if (!tokenDoc.isActive) {
      return res.status(401).json({
        success: false,
        message: tokenDoc.revokedAt ? 'Refresh token has been revoked' : 'Refresh token has expired'
      });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(tokenDoc.user._id);

    // Optionally rotate refresh token (create new one and revoke old one)
    const newRefreshToken = await RefreshToken.createToken(tokenDoc.user._id, getClientIp(req));
    await tokenDoc.revoke(getClientIp(req), 'Replaced by new token');
    tokenDoc.replacedByToken = newRefreshToken.token;
    await tokenDoc.save();

    // Set new cookies
    setAuthCookies(res, newAccessToken, newRefreshToken.token);

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully'
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to refresh token',
      error: error.message
    });
  }
});

// Revoke refresh token (logout)
router.post('/revoke-token', authenticateToken, async (req, res) => {
  try {
    // Get refresh token from cookie instead of body
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    const tokenDoc = await RefreshToken.findOne({ token: refreshToken });

    if (!tokenDoc) {
      return res.status(404).json({
        success: false,
        message: 'Refresh token not found'
      });
    }

    // Verify token belongs to authenticated user
    if (tokenDoc.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to revoke this token'
      });
    }

    // Revoke the token
    await tokenDoc.revoke(getClientIp(req), 'Revoked by user');

    // Clear cookies
    clearAuthCookies(res);

    res.status(200).json({
      success: true,
      message: 'Token revoked successfully'
    });
  } catch (error) {
    console.error('Token revocation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to revoke token',
      error: error.message
    });
  }
});

// Logout (revoke all refresh tokens for user)
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // Revoke all active refresh tokens for this user
    const tokens = await RefreshToken.find({
      user: req.user._id,
      revokedAt: null
    });

    const ipAddress = getClientIp(req);
    await Promise.all(
      tokens.map(token => token.revoke(ipAddress, 'Logged out'))
    );

    // Clear cookies
    clearAuthCookies(res);

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
      data: {
        tokensRevoked: tokens.length
      }
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed',
      error: error.message
    });
  }
});

// Get all active refresh tokens for current user (for session management)
router.get('/sessions', authenticateToken, async (req, res) => {
  try {
    const tokens = await RefreshToken.find({
      user: req.user._id,
      revokedAt: null,
      expiresAt: { $gt: new Date() }
    }).select('createdByIp createdAt expiresAt').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        sessions: tokens
      }
    });
  } catch (error) {
    console.error('Sessions fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sessions',
      error: error.message
    });
  }
});

// Unlock account (admin or user can request unlock via email in future)
router.post('/unlock-account', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.body;
    
    // Allow users to unlock their own account or admins to unlock any account
    if (req.user.role !== 'admin' && req.user._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to unlock this account'
      });
    }

    const user = await User.findById(userId).select('+loginAttempts +lockUntil');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.resetLoginAttempts();

    res.status(200).json({
      success: true,
      message: 'Account unlocked successfully'
    });
  } catch (error) {
    console.error('Account unlock error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unlock account',
      error: error.message
    });
  }
});

// Verify email with token
router.get('/verify-email/:token', async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required'
      });
    }

    // Find user with this verification token
    const crypto = await import('crypto');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }

    // Verify the email
    const verified = await user.verifyEmail(token);

    if (!verified) {
      return res.status(400).json({
        success: false,
        message: 'Email verification failed'
      });
    }

    // Send success email
    try {
      await sendVerificationSuccessEmail(user.email, user.firstName);
    } catch (emailError) {
      console.error('Failed to send success email:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Email verification failed',
      error: error.message
    });
  }
});

// Resend verification email
router.post('/resend-verification', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      });
    }

    // Generate new verification token
    const verificationToken = user.generateVerificationToken();
    await user.save();

    // Send verification email
    await sendVerificationEmail(user.email, user.firstName, verificationToken);

    res.status(200).json({
      success: true,
      message: 'Verification email sent successfully'
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resend verification email',
      error: error.message
    });
  }
});

export default router;
