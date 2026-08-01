const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true
        },
        discountType: {
            type: String,
            enum: ['percentage', 'fixed'],
            required: true
        },
        discountValue: {
            type: Number,
            required: true
        },
        minOrderAmount: {
            type: Number,
            default: 0
        },
        usageLimit: {
            type: Number,
            default: null // null means unlimited
        },
        usedCount: {
            type: Number,
            default: 0
        },
        expiryDate: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active'
        }
    },
    {
        timestamps: true,
    }
);

// Check if coupon is valid
couponSchema.methods.isValid = function() {
    const isNotExpired = new Date() < this.expiryDate;
    const isUnderLimit = this.usageLimit === null || this.usedCount < this.usageLimit;
    return this.status === 'active' && isNotExpired && isUnderLimit;
};

module.exports = mongoose.model("Coupon", couponSchema);
