const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../models/Payment");

// Initialize Razorpay
// Using environment variables or fallback for safety if undefined
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder'
});

// @desc    Create Razorpay Order
// @route   POST /api/payment/razorpay
// @access  Private
const createRazorpayOrder = async (req, res) => {
    try {
        const { amount } = req.body; 
        
        if (!amount) {
            return res.status(400).json({ message: "Amount is required" });
        }

        const options = {
            amount: Math.round(amount * 100), // Razorpay expects amount in paise (smallest unit)
            currency: "INR", // Can be made dynamic from settings later
            receipt: `rcpt_${req.user._id.toString().slice(-6)}_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);
        
        if (!order) {
            return res.status(500).json({ message: "Failed to create Razorpay Order" });
        }

        res.json(order);
    } catch (error) {
        console.error("Razorpay Error:", error);
        res.status(500).json({ 
            message: error.error?.description || error.message || "Failed to contact Razorpay" 
        });
    }
};

// @desc    Verify Razorpay Signature
// @route   POST /api/payment/razorpay/verify
// @access  Private
const verifyRazorpaySignature = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, currency } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder')
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Store payment details in Database
            const payment = await Payment.create({
                user: req.user._id,
                razorpayOrderId: razorpay_order_id,
                razorpayPaymentId: razorpay_payment_id,
                razorpaySignature: razorpay_signature,
                amount: amount,
                currency: currency || "INR",
                paymentMethod: "Razorpay",
                paymentStatus: "Success"
            });

            res.json({ 
                message: "Payment verified successfully", 
                paymentId: razorpay_payment_id,
                paymentRecordId: payment._id
            });
        } else {
            // Optionally log failed payment attempt
            await Payment.create({
                user: req.user._id,
                razorpayOrderId: razorpay_order_id,
                razorpayPaymentId: razorpay_payment_id,
                razorpaySignature: razorpay_signature,
                amount: amount,
                currency: currency || "INR",
                paymentMethod: "Razorpay",
                paymentStatus: "Failed"
            });

            res.status(400).json({ message: "Invalid Signature" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all payments
// @route   GET /api/payment
// @access  Private/Admin
const getPayments = async (req, res) => {
    try {
        const payments = await Payment.find({}).populate('user', 'name email').sort({ createdAt: -1 });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createRazorpayOrder,
    verifyRazorpaySignature,
    getPayments
};
