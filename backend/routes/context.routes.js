const express = require('express');
const authenicate = require('../middleware/authenticate');
const { createContext, getAllContexts, editContext, getContextById } = require('../controllers/context.controller');
const router = express.Router();

router.post('/create-context', authenicate, createContext);
router.get('/get-all-contexts', authenicate, getAllContexts);
router.put('/edit-context', authenicate, editContext);
router.get('/get-context/:contextId', getContextById);

module.exports = router;