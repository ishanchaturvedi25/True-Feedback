const express = require('express');
const router = express.Router();
const { submitFeedback, getAllFeedbacksByContextId } = require('../controllers/feedback.controller');
const authenicate = require('../middleware/authenticate');
const { getContextById } = require('../controllers/feedback.controller');

router.post('/submit-feedback/:contextId', submitFeedback);
router.get('/get-context/:contextId', getContextById);
router.get('/get-all-feedbacks/:contextId', authenicate, getAllFeedbacksByContextId);

module.exports = router;