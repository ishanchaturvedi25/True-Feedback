const express = require('express');
const { registerUser, verifyOtp, getOtp } = require('../controllers/user.controller');
const router = express.Router();

router.post('/register', registerUser);
router.post('/verify-otp', verifyOtp);
router.post('/get-otp', getOtp);

module.exports = router;