const express = require('express');
const router = express.Router();
const { sendMessage, getConversationHistory } = require('../controllers/chatbotController');

// Public routes - no authentication required
router.post('/message', sendMessage);
router.get('/history', getConversationHistory);

module.exports = router;