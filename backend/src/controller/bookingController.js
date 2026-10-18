import Booking from '../models/bookingModel.js';
import Vehicle from '../models/vehicleModel.js';
import User from '../models/userModel.js';
import mongoose from 'mongoose';

// @desc    Create new rental booking with automated duration & price calculation
// @route   POST /api/bookings
export const createBooking = async (req, res) => {
  try {
    const {
      vehicleId,
      startDate,
      endDate,
      pickupTime,
      returnTime,
      pickupLocation,
      returnLocation,
    } = req.body;

    if (!vehicleId || !startDate || !endDate || !pickupLocation || !returnLocation) {
      return res.status(400).json({ success: false, message: 'Please provide all booking details' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return res.status(400).json({ success: false, message: 'Return date must be strictly after pickup date' });
    }

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    // Check driving license status of user
    const user = await User.findById(req.user._id);
    if (user.licenseStatus !== 'verified') {
      return res.status(403).json({
        success: false,
        message: 'Your driving license must be verified by an admin before you can book a vehicle. Please upload your license in your profile.',
        licenseStatus: user.licenseStatus,
      });
    }

    // Check for conflicting bookings
    const existingConflict = await Booking.findOne({
      vehicle: vehicleId,
      status: 'confirmed',
      $or: [{ startDate: { $lte: end }, endDate: { $gte: start } }],
    });

    if (existingConflict) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle is already reserved for the selected date range. Please select different dates.',
      });
    }

    // Calculate duration in days (minimum 1 day)
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const totalPrice = totalDays * vehicle.pricePerDay;

    const booking = await Booking.create({
      vehicle: vehicleId,
      user: req.user._id,
      startDate: start,
      endDate: end,
      pickupTime: pickupTime || '10:00 AM',
      returnTime: returnTime || '10:00 AM',
      pickupLocation,
      returnLocation,
      totalDays,
      pricePerDay: vehicle.pricePerDay,
      totalPrice,
      status: 'confirmed',
    });

    const populatedBooking = await Booking.findById(booking._id).populate('vehicle');

    res.status(201).json({
      success: true,
      message: 'Rental booking confirmed successfully!',
      data: populatedBooking,
    });
  } catch (error) {
    console.error('Create booking error:', error.message);
    res.status(500).json({ success: false, message: 'Server error creating booking' });
  }
};

// @desc    Get logged in user's bookings
// @route   GET /api/bookings/my
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('vehicle')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Admin: Get all customer bookings
// @route   GET /api/bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('vehicle')
      .populate('user', 'name email phone drivingLicenseNumber licenseStatus')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: 'Invalid Booking ID' });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Ensure user owns booking or is admin
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this booking' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({ success: true, message: 'Booking cancelled successfully', data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Admin: Update booking status (confirmed, completed, cancelled)
// @route   PUT /api/bookings/:id/status
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({ success: true, message: `Booking status updated to ${status}`, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
