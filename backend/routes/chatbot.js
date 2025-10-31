const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { sendMessage } = require('../controllers/chatbotController');

router.post('/message', protect, sendMessage);

module.exports = router;
