const express = require('express');
const { register, login, registerOwner, loginOwner } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/registerOwner', registerOwner);
router.post('/login', login);
router.post('/loginOwner', loginOwner);

module.exports = router;
