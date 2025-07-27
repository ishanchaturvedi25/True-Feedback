const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
    contextId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Context',
        required: true
    },
    message: {
        type: String,
        required: true,
        trim: true,
        minlength: [3, 'Feedback message must be at least 3 characters long']
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

FeedbackSchema.index({ receiverId: 1 });
FeedbackSchema.index({ contextId: 1 });

const FeedbackModel = mongoose.model('Feedback', FeedbackSchema);

module.exports = FeedbackModel;