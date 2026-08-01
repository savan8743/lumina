const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true },
    flavour: { type: String },
    weight: { type: String }
});

const timelineSchema = new mongoose.Schema({
    status: { 
        type: String, 
        enum: ['Order Placed', 'Payment Confirmed', 'Processing', 'Packed', 'Shipped', 'Out For Delivery', 'Delivered', 'Cancelled', 'Returned'], 
        required: true 
    },
    date: { type: Date, default: Date.now },
    description: { type: String }
});

const orderSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        orderItems: [orderItemSchema],
        shippingAddress: {
            street: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            zipCode: { type: String, required: true },
            country: { type: String, required: true }
        },
        paymentMethod: { type: String, required: true }, // e.g., 'Razorpay', 'COD'
        paymentResult: {
            id: { type: String },
            status: { type: String },
            update_time: { type: String },
            email_address: { type: String }
        },
        razorpayOrderId: { type: String },
        razorpayPaymentId: { type: String },
        paymentReference: { type: String },
        
        itemsPrice: { type: Number, required: true, default: 0.0 },
        taxPrice: { type: Number, required: true, default: 0.0 },
        shippingPrice: { type: Number, required: true, default: 0.0 },
        discountPrice: { type: Number, default: 0.0 },
        totalPrice: { type: Number, required: true, default: 0.0 },
        
        isPaid: { type: Boolean, required: true, default: false },
        paidAt: { type: Date },
        
        status: { 
            type: String, 
            enum: ['Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled', 'Returned'],
            default: 'Processing'
        },
        timeline: [timelineSchema]
    },
    {
        timestamps: true,
    }
);

// Auto-add "Order Placed" timeline entry on creation
orderSchema.pre('save', function(next) {
    if (this.isNew) {
        this.timeline.push({
            status: 'Order Placed',
            description: 'Your order has been placed successfully.'
        });
    }
    next();
});

module.exports = mongoose.model("Order", orderSchema);
