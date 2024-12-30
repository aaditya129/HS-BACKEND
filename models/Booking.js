const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  seater: {
    type: String,
    required: true
  },
  numberOfTenants: {
    type: Number,
    required: true
  },
  lengthOfStay: {
    type: Number,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  mobileNumber: {
    type: String,
    required: true
  },
  emailAddress: {
    type: String,
    required: true
  },
  paymentOption: {
    type: String,
    required: true,
    enum: ['bank', 'esewa'] // Enum to allow specific options
  },
  paymentScreenshot: {
    type: String // Path to the payment screenshot
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'completed']
  },
  advanceAmount: {
    type: Number, // Advance amount paid
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', BookingSchema);
