const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true, min: 1 },
    flavour: { type: String },
    weight: { type: String }
});

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true
        },
        items: [cartItemSchema],
        coupon: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Coupon'
        },
        subTotal: { type: Number, default: 0 },
        discountAmount: { type: Number, default: 0 },
        totalPrice: { type: Number, default: 0 }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Cart", cartSchema);
