import express from 'express';
import Booking from '../models/Booking.js';
import Car from '../models/Car.js';
import User from '../models/User.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { validateBooking, validateObjectId, handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

// Get user's bookings
router.get('/my-bookings', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const filter = { user: req.user._id };
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const bookings = await Booking.find(filter)
      .populate('car', 'make model year category images pricePerDay')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(filter);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.status(200).json({
      success: true,
      data: {
        bookings,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
      error: error.message
    });
  }
});

// Get all bookings (Admin only)
router.get('/all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, userId, carId } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (userId) filter.user = userId;
    if (carId) filter.car = carId;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const bookings = await Booking.find(filter)
      .populate('user', 'firstName lastName email phone')
      .populate('car', 'make model year licensePlate location')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(filter);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.status(200).json({
      success: true,
      data: {
        bookings,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
      error: error.message
    });
  }
});

// Get single booking
router.get('/:id', authenticateToken, validateObjectId, handleValidationErrors, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'firstName lastName email phone')
      .populate('car')
      .populate('driverInfo.primaryDriver', 'firstName lastName email')
      .populate('driverInfo.additionalDrivers', 'firstName lastName email');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns this booking or is admin
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        booking
      }
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking',
      error: error.message
    });
  }
});

// Create new booking
router.post('/', authenticateToken, validateBooking, handleValidationErrors, async (req, res) => {
  try {
    const {
      car: carId,
      startDate,
      endDate,
      pickupLocation,
      dropoffLocation,
      extras = [],
      insurance = { type: 'basic', price: 0 },
      paymentMethod
    } = req.body;

    // Check if car exists and is available
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    if (!car.availability || car.maintenanceStatus !== 'available') {
      return res.status(400).json({
        success: false,
        message: 'Car is not available for booking'
      });
    }

    // Check for conflicting bookings
    const conflictingBookings = await Booking.find({
      car: carId,
      status: { $in: ['confirmed', 'active'] },
      $or: [
        {
          startDate: { $lte: new Date(endDate) },
          endDate: { $gte: new Date(startDate) }
        }
      ]
    });

    if (conflictingBookings.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Car is not available for the selected dates'
      });
    }

    // Calculate total amount
    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    const extrasTotal = extras.reduce((sum, extra) => sum + (extra.price * (extra.quantity || 1)), 0);
    const totalAmount = (car.pricePerDay * totalDays) + extrasTotal + insurance.price;

    // Create booking
    const booking = new Booking({
      user: req.user._id,
      car: carId,
      startDate,
      endDate,
      pickupLocation,
      dropoffLocation,
      totalDays,
      pricePerDay: car.pricePerDay,
      totalAmount,
      extras,
      insurance,
      paymentMethod,
      driverInfo: {
        primaryDriver: req.user._id
      }
    });

    await booking.save();

    // Populate the booking for response
    await booking.populate('car', 'make model year category images');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        booking
      }
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create booking',
      error: error.message
    });
  }
});

// Update booking status (Admin only)
router.patch('/:id/status', authenticateToken, requireAdmin, validateObjectId, handleValidationErrors, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'confirmed', 'active', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('user', 'firstName lastName email')
     .populate('car', 'make model licensePlate');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      data: {
        booking
      }
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update booking status',
      error: error.message
    });
  }
});

// Cancel booking
router.patch('/:id/cancel', authenticateToken, validateObjectId, handleValidationErrors, async (req, res) => {
  try {
    const { cancellationReason } = req.body;

    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns this booking or is admin
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if booking can be cancelled
    if (['completed', 'cancelled'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: 'Booking cannot be cancelled'
      });
    }

    // Calculate refund amount (simple logic - can be enhanced)
    const now = new Date();
    const startDate = new Date(booking.startDate);
    const daysUntilStart = Math.ceil((startDate - now) / (1000 * 60 * 60 * 24));
    
    let refundPercentage = 0;
    if (daysUntilStart >= 7) {
      refundPercentage = 1.0; // 100% refund
    } else if (daysUntilStart >= 3) {
      refundPercentage = 0.5; // 50% refund
    } else if (daysUntilStart >= 1) {
      refundPercentage = 0.25; // 25% refund
    }

    const refundAmount = booking.totalAmount * refundPercentage;

    booking.status = 'cancelled';
    booking.cancellationReason = cancellationReason;
    booking.refundAmount = refundAmount;
    
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: {
        booking,
        refundAmount
      }
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel booking',
      error: error.message
    });
  }
});

export default router;
