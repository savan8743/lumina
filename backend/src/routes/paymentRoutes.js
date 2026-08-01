const express = require("express");
const router = express.Router();
const {
    createRazorpayOrder,
    verifyRazorpaySignature,
    getPayments
} = require("../controllers/paymentController");
const { protect, admin } = require("../middleware/authMiddleware");

router.route("/razorpay").post(protect, createRazorpayOrder);
router.route("/razorpay/verify").post(protect, verifyRazorpaySignature);
router.route("/").get(protect, admin, getPayments);

module.exports = router;
