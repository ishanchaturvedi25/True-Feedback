const express = require('express');
const router = express.Router();
const { submitFeedback, getAllFeedbacksByContextId } = require('../controllers/feedback.controller');
const authenicate = require('../middleware/authenticate');

router.post('/submit-feedback/:contextId', submitFeedback);
router.get('/get-all-feedbacks/:contextId', authenicate, getAllFeedbacksByContextId);

module.exports = router;