const express = require('express');
const router = express.Router();
const { getReviews, getAllReviewsAdmin, createReview, updateReview, deleteReview } = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getReviews);
router.get('/admin', protect, admin, getAllReviewsAdmin);
router.post('/', protect, admin, createReview);
router.put('/:id', protect, admin, updateReview);
router.delete('/:id', protect, admin, deleteReview);

module.exports = router;
