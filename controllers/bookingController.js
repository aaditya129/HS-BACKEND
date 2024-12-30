const Booking = require('../models/Booking');
const multer = require('multer');
const path = require('path');

// Configure Multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/payment_screenshots'); // Folder where images will be stored
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

const upload = multer({ storage }).single('paymentScreenshot');

// @route   POST /api/bookings
// @desc    Create a new booking with payment screenshot
// @access  Public
exports.createBooking = (req, res) => {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ msg: 'Error uploading image' });
      }
  
      const { seater, numberOfTenants, lengthOfStay, fullName, address, mobileNumber, emailAddress, paymentOption, advanceAmount } = req.body;
  
      // Validate required fields
      if (!seater || !numberOfTenants || !lengthOfStay || !fullName || !address || !mobileNumber || !emailAddress || !paymentOption || !advanceAmount) {
        return res.status(400).json({ msg: 'Please fill in all required fields' });
      }
  
      try {
        // Create a new booking
        const newBooking = new Booking({
          seater,
          numberOfTenants,
          lengthOfStay,
          fullName,
          address,
          mobileNumber,
          emailAddress,
          paymentOption,
          advanceAmount,
          paymentScreenshot: req.file ? req.file.path : undefined, // Store image path if uploaded
          status: 'pending'
        });
  
        await newBooking.save();
  
        res.status(201).json({ msg: 'Booking created successfully', booking: newBooking });
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    });
  };

exports.updateBookingStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
  
    // Validate status field
    if (!['pending', 'completed'].includes(status)) {
      return res.status(400).json({ msg: 'Invalid status value' });
    }
  
    try {
      // Find the booking by ID
      const booking = await Booking.findById(id);
  
      if (!booking) {
        return res.status(404).json({ msg: 'Booking not found' });
      }
  
      // Update booking status
      booking.status = status;
      await booking.save();
  
      res.status(200).json({ msg: 'Booking status updated successfully', booking });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };

  exports.getAllBookings = async (req, res) => {
    try {
      const bookings = await Booking.find();
      res.status(200).json(bookings);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };