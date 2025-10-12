import express from 'express';
import Booking from '../models/Booking.js';
import Car from '../models/Car.js';
import User from '../models/User.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { requireEmailVerification } from '../middleware/emailVerification.js';
import { validateBooking, validateObjectId, handleValidationErrors } from '../middleware/validation.js';
import { updateBookingStatuses, updateSingleBookingStatus } from '../middleware/bookingStatusMiddleware.js';
import BookingStatusService from '../services/bookingStatusService.js';

const router = express.Router();

// Get user's bookings
router.get('/my-bookings', authenticateToken, updateBookingStatuses, async (req, res) => {
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

// Get booking stats (Admin only)
router.get('/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const stats = await Booking.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Convert to object with default values
    const statusCounts = {
      pending: 0,
      confirmed: 0,
      active: 0,
      completed: 0,
      cancelled: 0
    };

    stats.forEach(stat => {
      if (statusCounts.hasOwnProperty(stat._id)) {
        statusCounts[stat._id] = stat.count;
      }
    });

    const totalBookings = Object.values(statusCounts).reduce((sum, count) => sum + count, 0);

    res.status(200).json({
      success: true,
      data: {
        statusCounts,
        totalBookings
      }
    });
  } catch (error) {
    console.error('Get booking stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking stats',
      error: error.message
    });
  }
});

// Get all bookings (Admin only)
router.get('/all', authenticateToken, requireAdmin, updateBookingStatuses, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, userId, carId } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (userId) filter.user = userId;
    if (carId) filter.car = carId;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const bookings = await Booking.find(filter)
      .populate('user', 'firstName lastName email phone address')
      .populate('car', 'name make model year location')
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
router.get('/:id', authenticateToken, validateObjectId, handleValidationErrors, updateSingleBookingStatus, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'firstName lastName email phone address')
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
router.post('/', authenticateToken, requireEmailVerification, validateBooking, handleValidationErrors, async (req, res) => {
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

    // Calculate total amount using inclusive date calculation 
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Set to start of day to ensure accurate calculation
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    
    const differenceInTime = end.getTime() - start.getTime();
    const totalDays = Math.floor(differenceInTime / (1000 * 3600 * 24)) + 1; // +1 for inclusive range
    
    const extrasTotal = extras.reduce((sum, extra) => sum + (extra.price * (extra.quantity || 1) * totalDays), 0);
    const totalAmount = (car.pricePerDay * totalDays) + extrasTotal + insurance.price;

    // Ensure location objects have required address field
    const processedPickupLocation = {
      branch: pickupLocation.branch,
      address: pickupLocation.address || `${pickupLocation.branch} Branch, Main Location`
    };
    
    const processedDropoffLocation = {
      branch: dropoffLocation.branch,
      address: dropoffLocation.address || `${dropoffLocation.branch} Branch, Main Location`
    };

    // Create booking
    const booking = new Booking({
      user: req.user._id,
      car: carId,
      startDate,
      endDate,
      pickupLocation: processedPickupLocation,
      dropoffLocation: processedDropoffLocation,
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
    
    // Validate status
    const validStatuses = ['pending', 'confirmed', 'active', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'name email')
     .populate('car', 'brand model year');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      data: booking
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

// Update booking details (Admin only)
router.patch('/:id', authenticateToken, requireAdmin, validateObjectId, handleValidationErrors, async (req, res) => {
  try {
    const allowedUpdates = ['status', 'startDate', 'endDate', 'pickupLocation', 'dropoffLocation', 'notes'];
    const updates = {};
    
    // Filter only allowed fields
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    // Validate dates if provided
    if (updates.startDate && updates.endDate) {
      const startDate = new Date(updates.startDate);
      const endDate = new Date(updates.endDate);
      
      if (startDate >= endDate) {
        return res.status(400).json({
          success: false,
          message: 'End date must be after start date'
        });
      }
      
      if (startDate < new Date()) {
        return res.status(400).json({
          success: false,
          message: 'Start date cannot be in the past'
        });
      }
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('user', 'name email')
     .populate('car', 'brand model year');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      data: booking
    });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update booking',
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

    // Calculate refund amount (simple logic)
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

// Delete booking (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, validateObjectId, handleValidationErrors, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    await Booking.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete booking',
      error: error.message
    });
  }
});

// Bulk delete bookings (Admin only)
router.delete('/bulk/delete', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { bookingIds } = req.body;
    
    if (!bookingIds || !Array.isArray(bookingIds) || bookingIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking IDs provided'
      });
    }

    // Validate all booking IDs are valid ObjectIds
    const mongoose = await import('mongoose');
    const invalidIds = bookingIds.filter(id => !mongoose.default.Types.ObjectId.isValid(id));
    if (invalidIds.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID format',
        invalidIds
      });
    }

    // Check if bookings exist
    const existingBookings = await Booking.find({ _id: { $in: bookingIds } });
    const existingIds = existingBookings.map(booking => booking._id.toString());
    const notFoundIds = bookingIds.filter(id => !existingIds.includes(id));
    
    if (notFoundIds.length > 0) {
      return res.status(404).json({
        success: false,
        message: 'Some bookings not found',
        notFoundIds
      });
    }

    // Delete all bookings
    const deleteResult = await Booking.deleteMany({ _id: { $in: bookingIds } });

    res.status(200).json({
      success: true,
      message: `Successfully deleted ${deleteResult.deletedCount} booking(s)`,
      deletedCount: deleteResult.deletedCount
    });
  } catch (error) {
    console.error('Bulk delete bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete bookings',
      error: error.message
    });
  }
});

// Manual status update endpoint (Admin only)
router.post('/update-statuses', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await BookingStatusService.updateBookingStatuses();
    
    res.status(200).json({
      success: true,
      message: 'Booking statuses updated successfully',
      data: result
    });
  } catch (error) {
    console.error('Manual status update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update booking statuses',
      error: error.message
    });
  }
});

// Get bookings needing status updates (Admin only - for monitoring)
router.get('/status-check', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const bookingsNeedingUpdate = await BookingStatusService.getBookingsNeedingUpdate();
    
    res.status(200).json({
      success: true,
      data: bookingsNeedingUpdate
    });
  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check booking statuses',
      error: error.message
    });
  }
});

export default router;
