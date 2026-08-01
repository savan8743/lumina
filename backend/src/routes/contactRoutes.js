const express = require('express');
const router = express.Router();
const { submitContactMessage, getAllMessagesAdmin, updateMessageStatus, deleteMessage } = require('../controllers/contactController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', submitContactMessage);
router.get('/admin', protect, admin, getAllMessagesAdmin);
router.put('/:id', protect, admin, updateMessageStatus);
router.delete('/:id', protect, admin, deleteMessage);

module.exports = router;
