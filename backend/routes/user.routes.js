const express = require('express');
const { registerUser, verifyOtp, getOtp, login, logout, getUserDetails } = require('../controllers/user.controller');
const authenicate = require('../middleware/authenticate');
const router = express.Router();

router.post('/register', registerUser);
router.post('/verify-otp', authenicate, verifyOtp);
router.post('/get-otp', authenicate, getOtp);
router.post('/login', login);
router.post('/logout', authenicate, logout);
router.post('/me', authenicate, getUserDetails);

module.exports = router;