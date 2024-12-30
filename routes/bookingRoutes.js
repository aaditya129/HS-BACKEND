const express = require('express');
const { createBooking, updateBookingStatus, getAllBookings } = require('../controllers/bookingController');
const router = express.Router();

// @route   POST /api/bookings
// @desc    Create a new booking
router.post('/', createBooking);

// @route   PUT /api/bookings/:id/status
// @desc    Update booking status by admin
router.put('/:id/status', updateBookingStatus);

// @route   GET /api/bookings
// @desc    Get all bookings
router.get('/', getAllBookings);

module.exports = router;
