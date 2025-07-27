const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const generateOtp = require('../utils/generateOtp');
const sendEmail = require('../utils/sendEmail');

const registerUser = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;

        if (!name || !username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (name.length < 6) {
            return res.status(400).json({ message: 'Name must be at least 6 characters long' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        const existingUser  = await userModel.findOne({ $or: [{email}, {username}] });

        if (existingUser && existingUser.email === email) {
            return res.status(202).json({ message: 'Please verify your email address' });
        } else if (existingUser && existingUser.username === username) {
            return res.status(400).json({ message: 'Username already exists' });
        } else {
            const newPassword = await bcrypt.hash(password, 10);
            const otp = generateOtp();
            const newUser = await userModel.create({
                name,
                username,
                email,
                password: newPassword,
                otp: {
                    code: otp
                }
            });
            newUser.lastOtpSentTime = new Date();
            await newUser.save();
            sendEmail(email, 'Verify your email', `Your OTP is ${otp}`, `<p>Your OTP is <strong>${otp}</strong></p>`);
            return res.status(201).json({ message: 'User registered successfully, please verify your email' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error while registering user' });
    }
}

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        console.log('user.otp: ', user.otp);
        if (user.otp.code !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }
        // if (user.otp.expiry < new Date()) {
        //     return res.status(400).json({ message: 'OTP has expired' });
        // }
        user.isEmailVerified = true;
        user.otp = null;
        await user.save();
        console.log('reached here: ', user);
        const token = jwt.sign({ userId: user._id, email: user.email }, process.env.jwt_secret, { expiresIn: '1h' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
        return res.status(201).json({
            message: 'User registered successfully',
            user,
            token
        });
    } catch (error) {
        console.error('Error verifying OTP: ', error);
        return res.status(500).json({ message: 'Internal server error while verifying OTP' });
    }
}

const getOtp = async (req, res) => {
    try {
        const { email, username } = req.body;
        if (!email || !username) {
            return res.status(400).json({ message: 'Email or username are required' });
        }
        const user = await userModel.findOne({ $or: [{ email }, { username }] });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.lastOtpSentTime && new Date() - user.lastOtpSentTime < 60000) {
            return res.status(429).json({ message: 'Please wait before requesting another OTP' });
        }
        user.lastOtpSentTime = new Date();
        const otp = generateOtp();
        user.otp.code = otp;
        user.otp.expiry = new Date(Date.now() + 30 * 1000);
        await user.save();
        await sendEmail(email, 'Verify your email', `Your OTP is ${otp}`, `<p>Your OTP is <strong>${otp}</strong></p>`);
        return res.status(200).json({ message: 'OTP generated and sent to email' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error while generating OTP' });
    }
}

module.exports = {
    registerUser,
    verifyOtp,
    getOtp
};