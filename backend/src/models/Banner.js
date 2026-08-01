const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        subtitle: { type: String },
        image: { type: String, required: true },
        mobileImage: { type: String },
        link: { type: String },
        position: { 
            type: String, 
            enum: ['homepage_slider', 'offer_banner', 'category_banner'], 
            required: true 
        },
        priority: { type: Number, default: 0 },
        status: { type: String, enum: ['active', 'inactive'], default: 'active' }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Banner", bannerSchema);
