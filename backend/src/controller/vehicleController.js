import Vehicle from '../models/vehicleModel.js';
import Booking from '../models/bookingModel.js';
import mongoose from 'mongoose';

// @desc    Get all vehicles with search, filters and sorting
// @route   GET /api/vehicles
export const getVehicles = async (req, res) => {
  try {
    const { search, type, category, fuelType, location, sortPrice, availableOnly } = req.query;

    let query = {};

    // Search by name, brand, or category
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by type: Car or Bike
    if (type && ['Car', 'Bike'].includes(type)) {
      query.type = type;
    }

    // Filter by category
    if (category) {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    // Filter by fuel type
    if (fuelType) {
      query.fuelType = { $regex: new RegExp(`^${fuelType}$`, 'i') };
    }

    // Filter by location
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Filter available only
    if (availableOnly === 'true') {
      query.isAvailable = true;
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sortPrice === 'low-to-high' || sortPrice === 'p-asc') {
      sortOption = { pricePerDay: 1 };
    } else if (sortPrice === 'high-to-low' || sortPrice === 'p-desc') {
      sortOption = { pricePerDay: -1 };
    } else if (sortPrice === 'rating') {
      sortOption = { rating: -1 };
    }

    const vehicles = await Vehicle.find(query).sort(sortOption);

    res.status(200).json({
      success: true,
      count: vehicles.length,
      data: vehicles,
    });
  } catch (error) {
    console.error('Error fetching vehicles:', error.message);
    res.status(500).json({ success: false, message: 'Server error fetching vehicles' });
  }
};

// @desc    Get single vehicle details
// @route   GET /api/vehicles/:id
export const getVehicleById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: 'Invalid Vehicle ID' });
    }

    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    res.status(200).json({ success: true, data: vehicle });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Create new vehicle (Admin / CRUD)
// @route   POST /api/vehicles
export const createVehicle = async (req, res) => {
  try {
    const {
      name,
      brand,
      type,
      category,
      pricePerDay,
      fuelType,
      seatingCapacity,
      mileage,
      location,
      imageUrl,
      description,
      isAvailable,
    } = req.body;

    if (!name || !brand || !type || !category || !pricePerDay || !fuelType || !seatingCapacity || !mileage || !location || !imageUrl) {
      return res.status(400).json({ success: false, message: 'Please provide all required vehicle fields' });
    }

    const vehicle = await Vehicle.create({
      name,
      brand,
      type,
      category,
      pricePerDay: Number(pricePerDay),
      fuelType,
      seatingCapacity: Number(seatingCapacity),
      mileage,
      location,
      imageUrl,
      description: description || `${brand} ${name} in excellent condition for rent.`,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
    });

    res.status(201).json({ success: true, message: 'Vehicle created successfully', data: vehicle });
  } catch (error) {
    console.error('Error creating vehicle:', error.message);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Update vehicle details (Admin / CRUD)
// @route   PUT /api/vehicles/:id
export const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: 'Invalid Vehicle ID' });
    }

    const updatedVehicle = await Vehicle.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedVehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    res.status(200).json({ success: true, message: 'Vehicle updated successfully', data: updatedVehicle });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Delete vehicle (Admin / CRUD)
// @route   DELETE /api/vehicles/:id
export const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: 'Invalid Vehicle ID' });
    }

    const vehicle = await Vehicle.findByIdAndDelete(id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    // Also cancel or clean up pending bookings for this vehicle
    await Booking.deleteMany({ vehicle: id });

    res.status(200).json({ success: true, message: 'Vehicle deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Add Review and Rating
// @route   POST /api/vehicles/:id/reviews
export const addVehicleReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: 'Rating and comment are required' });
    }

    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    const review = {
      userName: req.user ? req.user.name : (req.body.userName || 'Anonymous Renter'),
      rating: Number(rating),
      comment,
      date: new Date(),
    };

    vehicle.reviews.push(review);

    // Recalculate average rating
    const totalRating = vehicle.reviews.reduce((acc, item) => item.rating + acc, 0);
    vehicle.rating = Number((totalRating / vehicle.reviews.length).toFixed(1));

    await vehicle.save();

    res.status(201).json({ success: true, message: 'Review added successfully', data: vehicle });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error adding review' });
  }
};

// @desc    Check Vehicle Availability for specific date range
// @route   GET /api/vehicles/:id/availability
export const checkAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ success: false, message: 'Please provide start and end dates' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return res.status(400).json({ success: false, message: 'End date must be after start date' });
    }

    // Check vehicle exists and is globally available
    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    if (!vehicle.isAvailable) {
      return res.status(200).json({
        success: true,
        available: false,
        message: 'Vehicle is currently marked under maintenance or unavailable',
      });
    }

    // Check overlapping bookings
    const overlappingBookings = await Booking.find({
      vehicle: id,
      status: 'confirmed',
      $or: [
        { startDate: { $lte: end }, endDate: { $gte: start } },
      ],
    });

    const isAvailable = overlappingBookings.length === 0;

    res.status(200).json({
      success: true,
      available: isAvailable,
      message: isAvailable
        ? 'Vehicle is available for the selected dates!'
        : 'Vehicle is already booked for these dates. Please choose another date or vehicle.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error checking availability' });
  }
};
