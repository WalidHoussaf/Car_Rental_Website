import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import Car from '../models/Car.js';
import Booking from '../models/Booking.js';
import { authenticateToken, requireAdmin, optionalAuth } from '../middleware/auth.js';
import { validateCar, validateCarUpdate, validateCarSearch, validateObjectId, handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.resolve('uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]/g, '_');
    cb(null, `${unique}-${base}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (/^image\//.test(file.mimetype)) cb(null, true);
  else cb(new Error('Only image files are allowed'));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024, files: 10 } });

// Upload car images (Admin only)
router.post('/upload', authenticateToken, requireAdmin, upload.array('images', 10), (req, res) => {
  try {
    const files = req.files || [];
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const urls = files.map(f => ({
      filename: f.filename,
      url: `${baseUrl}/uploads/${f.filename}`,
      mimetype: f.mimetype,
      size: f.size,
    }));
    return res.status(201).json({ success: true, data: { files: urls } });
  } catch (e) {
    return res.status(500).json({ success: false, message: 'Upload failed', error: e.message });
  }
});

// Get all cars with filtering and pagination
router.get('/', validateCarSearch, handleValidationErrors, optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      minPrice,
      maxPrice,
      transmission,
      fuelType,
      seats,
      location,
      search,
      startDate,
      endDate,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};

    // Handle availability filtering
    if (req.query.availability === 'true') {
      filter.availability = true;
    } else if (req.query.availability === 'false') {
      filter.availability = false;
    } else if (req.query.availability === 'all') {
      // Don't add availability filter - show all cars
    } else {
      // Default behavior for public users - only show available cars
      if (!req.user || !req.user.isAdmin) {
        filter.availability = true;
        filter.maintenanceStatus = 'available';
      }
    }

    if (req.query.maintenanceStatus) {
      filter.maintenanceStatus = req.query.maintenanceStatus;
    }

    if (category && category !== 'all') filter.category = category;
    if (transmission) filter.transmission = transmission;
    if (fuelType) filter.fuelType = fuelType;
    if (seats) filter.seats = parseInt(seats);
    if (location && location !== 'all') {
      // Use $regex with $options for better MongoDB compatibility
      filter.location = { $regex: location, $options: 'i' };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter.pricePerDay = {};
      if (minPrice) filter.pricePerDay.$gte = parseFloat(minPrice);
      if (maxPrice) filter.pricePerDay.$lte = parseFloat(maxPrice);
    }

    // Text search
    if (search) {
      filter.$text = { $search: search };
    }

    // Check availability for specific dates
    if (startDate && endDate) {
      const unavailableCarIds = await Booking.find({
        status: { $in: ['confirmed', 'active'] },
        $or: [
          {
            startDate: { $lte: new Date(endDate) },
            endDate: { $gte: new Date(startDate) }
          }
        ]
      }).distinct('car');

      filter._id = { $nin: unavailableCarIds };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const cars = await Car.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Car.countDocuments(filter);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.status(200).json({
      success: true,
      data: {
        cars,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: total,
          itemsPerPage: parseInt(limit),
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Get cars error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cars',
      error: error.message
    });
  }
});

// Get single car by ID
router.get('/:id', validateObjectId, handleValidationErrors, optionalAuth, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    
    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        car
      }
    });
  } catch (error) {
    console.error('Get car error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch car',
      error: error.message
    });
  }
});

// Create new car (Admin only)
router.post('/', authenticateToken, requireAdmin, validateCar, handleValidationErrors, async (req, res) => {
  try {
    const car = new Car(req.body);
    await car.save();

    res.status(201).json({
      success: true,
      message: 'Car created successfully',
      data: {
        car
      }
    });
  } catch (error) {
    console.error('Create car error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'License plate already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create car',
      error: error.message
    });
  }
});

// Update car (Admin only)
router.put('/:id', authenticateToken, requireAdmin, validateObjectId, validateCarUpdate, handleValidationErrors, async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Car updated successfully',
      data: {
        car
      }
    });
  } catch (error) {
    console.error('Update car error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'License plate already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update car',
      error: error.message
    });
  }
});

// Delete car (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, validateObjectId, handleValidationErrors, async (req, res) => {
  try {
    // Check if car has active bookings
    const activeBookings = await Booking.countDocuments({
      car: req.params.id,
      status: { $in: ['confirmed', 'active'] }
    });

    if (activeBookings > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete car with active bookings'
      });
    }

    const car = await Car.findByIdAndDelete(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Car deleted successfully'
    });
  } catch (error) {
    console.error('Delete car error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete car',
      error: error.message
    });
  }
});

// Get car availability for specific dates
router.get('/:id/availability', validateObjectId, handleValidationErrors, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required'
      });
    }

    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    // Check for conflicting bookings
    const conflictingBookings = await Booking.find({
      car: req.params.id,
      status: { $in: ['confirmed', 'active'] },
      $or: [
        {
          startDate: { $lte: new Date(endDate) },
          endDate: { $gte: new Date(startDate) }
        }
      ]
    });

    const isAvailable = conflictingBookings.length === 0 && 
                       car.availability && 
                       car.maintenanceStatus === 'available';

    res.status(200).json({
      success: true,
      data: {
        available: isAvailable,
        conflictingBookings: conflictingBookings.length,
        car: {
          id: car._id,
          make: car.make,
          model: car.model,
          availability: car.availability,
          maintenanceStatus: car.maintenanceStatus
        }
      }
    });
  } catch (error) {
    console.error('Check availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check availability',
      error: error.message
    });
  }
});

// Get car categories
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await Car.distinct('category');
    
    res.status(200).json({
      success: true,
      data: {
        categories
      }
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
});

// Get car locations/branches
router.get('/meta/locations', async (req, res) => {
  try {
    const locations = await Car.distinct('location');
    
    res.status(200).json({
      success: true,
      data: {
        locations
      }
    });
  } catch (error) {
    console.error('Get locations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch locations',
      error: error.message
    });
  }
});

export default router;
