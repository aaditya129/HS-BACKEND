const User = require('../models/User');
const HostelOwner= require('../models/owneruser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const {
    fullName,
    email,
    password,
    confirmPassword,
    dateOfBirth,
    mobileNumber,
    address,
    profilePicture,
    gender,
    type,
  } = req.body;

  // Validate password and confirmPassword
  if (password !== confirmPassword) {
    return res.status(400).json({ msg: 'Passwords do not match' });
  }

  try {
    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create a new user instance
    user = new User({
      fullName,
      email,
      password,
      dateOfBirth,
      mobileNumber,
      address,
      profilePicture,
      gender,
      type,
    });

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save the user to the database
    await user.save();

    // Create a payload for JWT
    const payload = {
      user: {
        id: user.id,
      },
    };

    // Generate and return a JWT token
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.registerOwner = async (req, res) => {
  const {
    fullName,
    district,
    address,
    addressDetails,
    mobileNumber,
    contactNumber,
    faxNumber,
    email,
    password, // Added password
    website,
    hostelType,
    ownerDetail,
    ownerContactNumber,
    registrationNumber,
    panNumber,
    locationName,
    minimumRate,
    maximumRate,
    hostelLogo,
    hostelPanPhoto,
    hostelRegistrationPhoto,
    description,
    hostelOverview,
  } = req.body;

  try {
    // Check if the owner already exists
    let owner = await HostelOwner.findOne({ email });
    if (owner) {
      return res.status(400).json({ msg: 'Owner already exists' });
    }

    // Create a new owner instance
    owner = new HostelOwner({
      fullName,
      district,
      address,
      addressDetails,
      mobileNumber,
      contactNumber,
      faxNumber,
      email,
      password, // Save the hashed password
      website,
      hostelType,
      ownerDetail,
      ownerContactNumber,
      registrationNumber,
      panNumber,
      locationName,
      minimumRate,
      maximumRate,
      hostelLogo,
      hostelPanPhoto,
      hostelRegistrationPhoto,
      description,
      hostelOverview,
    });

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    owner.password = await bcrypt.hash(password, salt);

    // Save the owner to the database
    await owner.save();

    // Create a payload for JWT
    const payload = {
      owner: {
        id: owner.id,
      },
    };

    // Generate and return a JWT token
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


// Owner Login
exports.loginOwner = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the owner exists
    let owner = await HostelOwner.findOne({ email });
    if (!owner) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, owner.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Create a payload for JWT
    const payload = {
      owner: {
        id: owner.id,
      },
    };

    // Generate and return a JWT token
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};