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
            if (existingUser.isEmailVerified)
                return res.status(409).json({ message: 'Email is already registered' });
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
                    code: otp,
                    expiry: new Date(Date.now() + 60 * 1000)
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
        if (user.otp.code !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }
        if (user.otp.expiry < new Date()) {
            return res.status(400).json({ message: 'OTP has expired' });
        }
        user.isEmailVerified = true;
        user.otp = null;
        await user.save();
        const token = jwt.sign({ userId: user._id, email: user.email }, process.env.jwt_secret, { expiresIn: '120h' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 120 * 60 * 1000
        });
        return res.status(200).json({
            message: 'Email verified successfully',
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
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }
        const user = await userModel.findOne({ email });
        if (user.isEmailVerified) {
            return res.status(400).json({ message: 'Email is already verified' });
        }
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.lastOtpSentTime && new Date() - user.lastOtpSentTime < 60000) {
            return res.status(429).json({ message: 'Please wait before requesting another OTP' });
        }
        user.lastOtpSentTime = new Date();
        const otp = generateOtp();
        user.otp.code = otp;
        user.otp.expiry = new Date(Date.now() + 60 * 1000);
        await user.save();
        await sendEmail(email, 'Verify your email', `Your OTP is ${otp}`, `<p>Your OTP is <strong>${otp}</strong></p>`);
        return res.status(200).json({ message: 'OTP generated and sent to email' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error while generating OTP' });
    }
}

const login = async (req, res) => {
    try {
        const { identifier, password } = req.body;

        if (!identifier || !password) {
            return res.status(400).json({ message: 'Email or username and password are required' });
        }

        const isEmail = /^\S+@\S+\.\S+$/.test(identifier);
        const user = await userModel.findOne(
            isEmail ? { email: identifier } : { username: identifier }
        ).select('+password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        if (!user.isEmailVerified) {
            return res.status(202).json({ message: 'Please verify your email address' });
        }

        const token = jwt.sign({ userId: user._id, email: user.email }, process.env.jwt_secret, { expiresIn: '120h' });

        res.cookie('token', token, {
            sameSite: 'strict',
            secure: false,
            httpOnly: true,
            maxAge: 120 * 60 * 1000
        })

        return res.status(200).json({
            message: 'Login successful',
            user: {
                _id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                isReceivingFeedback: user.isReceivingFeedback,
                isEmailVerified: user.isEmailVerified
            },
            token
        });
    } catch (error) {
        console.error('Error during login: ', error);
        return res.status(500).json({ message: 'Internal server error during login' });
    }
}

const logout = (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
        return res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Error during logout: ', error);
        return res.status(500).json({ message: 'Internal server error during logout' });
    }
}

const getUserDetails = async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const user = await userModel.findById(req.userId).select('-otp');
        return res.status(200).json({ message: 'User details fetched successfully', user });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error fetching user details' });
    }
}

const updateReceiveFeedback = async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { enabled } = req.body;

        if (typeof enabled !== 'boolean') {
            return res.status(400).json({ message: 'Invalid request body' });
        }

        const user = await userModel.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.isReceivingFeedback !== enabled) {
            user.isReceivingFeedback = enabled;
            await user.save();
        }

        return res.status(200).json({ message: 'Feedback preference updated successfully', receiveFeedback: user.isReceivingFeedback });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error updating feedback preference' });
    }
}

const getFeedbackStatus = async (req, res) => {
    if (!req.userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const user = await userModel.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ receiveFeedback: user.isReceivingFeedback });
    } catch (error) {
        console.error('Error fetching user feedback status:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    registerUser,
    verifyOtp,
    getOtp,
    login,
    logout,
    getUserDetails,
    updateReceiveFeedback,
    getFeedbackStatus
};