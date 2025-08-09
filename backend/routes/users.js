import express from 'express';
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { validateObjectId, handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

// Get all users (Admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, search, role } = req.query;
    
    const filter = {};
    if (role) filter.role = role;
    
    // Search by name or email
    if (search) {
      filter.$or = [
        { firstName: new RegExp(search, 'i') },
        { lastName: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
});

// Get single user (Admin only)
router.get('/:id', authenticateToken, requireAdmin, validateObjectId, handleValidationErrors, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's booking statistics
    const bookingStats = await Booking.aggregate([
      { $match: { user: user._id } },
      {
        $group: {
          _id: null,
          totalBookings: { $sum: 1 },
          totalSpent: { $sum: '$totalAmount' },
          completedBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          cancelledBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
          }
        }
      }
    ]);

    const stats = bookingStats[0] || {
      totalBookings: 0,
      totalSpent: 0,
      completedBookings: 0,
      cancelledBookings: 0
    };

    res.status(200).json({
      success: true,
      data: {
        user,
        stats
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: error.message
    });
  }
});

// Update user role (Admin only)
router.patch('/:id/role', authenticateToken, requireAdmin, validateObjectId, handleValidationErrors, async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['customer', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user role',
      error: error.message
    });
  }
});

// Verify user account (Admin only)
router.patch('/:id/verify', authenticateToken, requireAdmin, validateObjectId, handleValidationErrors, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User verified successfully',
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Verify user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify user',
      error: error.message
    });
  }
});

// Delete user (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, validateObjectId, handleValidationErrors, async (req, res) => {
  try {
    // Check if user has active bookings
    const activeBookings = await Booking.countDocuments({
      user: req.params.id,
      status: { $in: ['confirmed', 'active'] }
    });

    if (activeBookings > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete user with active bookings'
      });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message
    });
  }
});

// Get user dashboard stats (for current user)
router.get('/dashboard/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get booking statistics
    const bookingStats = await Booking.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalBookings: { $sum: 1 },
          totalSpent: { $sum: '$totalAmount' },
          upcomingBookings: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$status', 'confirmed'] },
                    { $gte: ['$startDate', new Date()] }
                  ]
                },
                1,
                0
              ]
            }
          },
          activeBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
          },
          completedBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          }
        }
      }
    ]);

    const stats = bookingStats[0] || {
      totalBookings: 0,
      totalSpent: 0,
      upcomingBookings: 0,
      activeBookings: 0,
      completedBookings: 0
    };

    // Get recent bookings
    const recentBookings = await Booking.find({ user: userId })
      .populate('car', 'make model year images')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        stats,
        recentBookings
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats',
      error: error.message
    });
  }
});

export default router;
