const feedbackModel = require('../models/feedback.model');
const contextModel = require('../models/context.model');

const submitFeedback = async (req, res) => {
    try {
        const { contextId } = req.params;
        const { feedbackMessage } = req.body;

        if (!contextId || !feedbackMessage || feedbackMessage.trim() === '') {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (feedbackMessage.length < 3) {
            return res.status(400).json({ message: "Feedback message must be at least 3 characters long" });
        }

        const context = await contextModel.findById(contextId);
        if (!context) {
            return res.status(404).json({ message: "Context not found" });
        }

        const receiverId = context.userId;
        const feedback = new feedbackModel({
            contextId,
            message: feedbackMessage,
            receiverId
        });
        await feedback.save();
        res.status(201).json({ message: "Feedback submitted successfully", feedback });
    } catch (error) {
        console.error("Error submitting feedback:", error);
        res.status(500).json({ message: "Internal server error while submitting feedback" });
    }
}

const getAllFeedbacksByContextId = async (req, res) => {
    try {
        const { contextId } = req.params;
        if (!contextId) {
            return res.status(400).json({ message: "Context ID is required" });
        }
        const context = await contextModel.findById(contextId);
        if (!context) {
            return res.status(404).json({ message: "Context not found" });
        }
        if (context.userId.toString() !== req.userId.toString()) {
            return res.status(403).json({ message: "You do not have permission to view this feedback" });
        }
        const feedbacks = await feedbackModel.find({ contextId }).sort({ createdAt: -1 });
        res.status(200).json({ feedbacks });
    } catch (error) {
        console.error("Error fetching feedbacks:", error);
        res.status(500).json({ message: "Internal server error while fetching feedbacks" });
    }
}

const getContextById = async (req, res) => {
    try {
        const { contextId } = req.params;
        if (!contextId) {
            return res.status(400).json({ message: "Context ID is required" });
        }
        const context = await contextModel.findById(contextId);
        if (!context) {
            return res.status(404).json({ message: "Context not found" });
        }
        res.status(200).json({ context });
    } catch (error) {
        console.error("Error fetching context:", error);
        res.status(500).json({ message: "Internal server error while fetching context" });
    }
}

module.exports = {
    submitFeedback,
    getAllFeedbacksByContextId,
    getContextById
}