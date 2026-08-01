const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' }, // Linked after order is created
        razorpayOrderId: { type: String, required: true },
        razorpayPaymentId: { type: String },
        razorpaySignature: { type: String },
        amount: { type: Number, required: true },
        currency: { type: String, default: "INR" },
        paymentMethod: { type: String, default: "Razorpay" },
        paymentStatus: { type: String, enum: ['Pending', 'Success', 'Failed'], default: 'Pending' },
        transactionDate: { type: Date, default: Date.now }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Payment", paymentSchema);
