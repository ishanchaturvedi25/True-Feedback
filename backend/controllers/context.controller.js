const slugify = require('slugify');
const ContextModel = require('../models/context.model');

const createContext = async (req, res) => {
    try {
        const { label = '', description = '' } = req.body;

        if (!label || label.trim() === '') {
            return res.status(400).json({ message: 'Label is required' });
        }

        const userId = req.userId;
        const slug = slugify(label, { lower: true, strict: true });

        const existingContext = await ContextModel.findOne({ slug, userId });
        if (existingContext) {
            return res.status(400).json({ message: 'Context with this label already exists' });
        }

        const newContext = new ContextModel({
            slug,
            label,
            description,
            userId
        });

        await newContext.save();
        return res.status(201).json({
            message: 'Context created successfully',
            context: newContext
        });
    } catch (error) {
        console.error('Error creating context:', error);
        res.status(500).json({ message: 'Internal server error while creating context' });
    }
}

const getAllContexts = async (req, res) => {
    try {
        const userId = req.userId;
        const contexts = await ContextModel.find({ userId }).sort({ createdAt: -1 });
        return res.status(200).json(contexts);
    } catch (error) {
        console.error('Error fetching contexts:', error);
        res.status(500).json({ message: 'Internal server error while fetching contexts' });
    }
}

const editContext = async (req, res) => {
    try {
        const { contextId, label, description } = req.body;
        if (!contextId || !label) {
            return res.status(400).json({ message: 'Context ID and label are required' });
        }
        const userId = req.userId;
        const context = await ContextModel.findOne({ _id: contextId, userId });
        if (!context) {
            return res.status(404).json({ message: 'Context not found' });
        }
        const slug = slugify(label, { lower: true, strict: true });
        const existingContext = await ContextModel.findOne({ slug, userId });
        if (existingContext && existingContext._id.toString() !== contextId) {
            return res.status(400).json({ message: 'Context with this label already exists' });
        }
        context.label = label;
        context.slug = slug;
        context.description = description || '';
        await context.save();
        res.status(200).json({
            message: 'Context updated successfully',
            context
        });
    } catch (error) {
        console.error('Error editing context:', error);
        res.status(500).json({ message: 'Internal server error while editing context' });
    }
}

const getContextById = async (req, res) => {
    try {
        const { contextId } = req.params;
        if (!contextId) {
            return res.status(400).json({ message: 'Context ID is required' });
        }
        const userId = req.userId;
        const context = await ContextModel.findOne({ _id: contextId, userId });
        if (!context) {
            return res.status(404).json({ message: 'Context not found' });
        }
        res.status(200).json(context);
    } catch (error) {
        console.error('Error fetching context by ID:', error);
        res.status(500).json({ message: 'Internal server error while fetching context by ID' });
    }
}

module.exports = {
    createContext,
    editContext,
    getAllContexts,
    getContextById
};