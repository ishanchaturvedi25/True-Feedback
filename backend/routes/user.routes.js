const express = require('express');
const { registerUser, verifyOtp, getOtp, login, logout, getUserDetails } = require('../controllers/user.controller');
const authenicate = require('../middleware/authenticate');
const router = express.Router();

router.post('/register', registerUser);
router.post('/verify-otp', verifyOtp);
router.post('/get-otp', getOtp);
router.post('/login', login);
router.post('/logout', authenicate, logout);
router.get('/me', authenicate, getUserDetails);

module.exports = router;