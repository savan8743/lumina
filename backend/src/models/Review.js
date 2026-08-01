const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        role: { type: String, default: "Verified Buyer" },
        content: { type: String, required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        isApproved: { type: Boolean, default: true },
        avatarInitial: { type: String }
    },
    {
        timestamps: true,
    }
);

// Pre-save to auto-generate avatar initial if not provided
reviewSchema.pre('save', function(next) {
    if (!this.avatarInitial && this.name) {
        this.avatarInitial = this.name.charAt(0).toUpperCase();
    }
    next();
});

module.exports = mongoose.model("Review", reviewSchema);
