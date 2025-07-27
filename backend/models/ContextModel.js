const mongoose = require('mongoose');

const ContextSchema = new mongoose.Schema({
    slug: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    label: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: false,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

ContextSchema.index({ userId: 1, slug: 1 }, { unique: true });

const ContextModel = mongoose.model('Context', ContextSchema);

module.exports = ContextModel;