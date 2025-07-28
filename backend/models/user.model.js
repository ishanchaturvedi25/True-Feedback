const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'Password must be at least 6 characters'],
        select: false
    },
    isReceivingFeedback: {
        type: Boolean,
        default: false
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    contexts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Context'
    }],
    otp: {
        code: {
            type: String,
            minlength: [6, 'OTP must be 6 digits long'],
            maxlength: [6, 'OTP must be 6 digits long']
        },
        expiry: {
            type: Date
        }
    },
    lastOtpSentTime: {
        type: Date,
        default: null
    }
}, { timestamps: true });

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;