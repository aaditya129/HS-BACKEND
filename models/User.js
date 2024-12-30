const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default: null,
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true,
  },
  type: {
    type: String,
    enum: ['student', 'non-student'],
    required: true,
  },
});

module.exports = mongoose.model('User', userSchema);
