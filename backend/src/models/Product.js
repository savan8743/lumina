const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    adminReply: { type: String }
}, { timestamps: true });

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, lowercase: true },
        category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
        
        description: { type: String, required: true },
        specification: { type: String },
        usageInstructions: { type: String },
        ingredients: { type: String },
        nutritionFacts: { type: String },
        benefits: [{ type: String }],
        
        price: { type: Number, required: true, default: 0 },
        discount: { type: Number, default: 0 }, // percentage
        salePrice: { type: Number },
        
        sku: { type: String, required: true, unique: true },
        stock: { type: Number, required: true, default: 0 },
        
        images: [{ type: String }],
        thumbnail: { type: String },
        
        flavours: [{ type: String }],
        weightOptions: [{ type: String }],
        sizes: [{ type: String }],
        tags: [{ type: String }],
        
        isFeatured: { type: Boolean, default: false },
        isBestSeller: { type: Boolean, default: false },
        status: { type: String, enum: ['active', 'inactive', 'draft'], default: 'active' },
        
        reviews: [reviewSchema],
        rating: { type: Number, required: true, default: 0 },
        numReviews: { type: Number, required: true, default: 0 },
        
        bulletPoints: [{ type: String }],
        highlights: [{
            icon: { type: String },
            title: { type: String },
            subtitle: { type: String }
        }],
        variants: [{
            weight: { type: String },
            price: { type: Number },
            originalPrice: { type: Number },
            label: { type: String },
            sku: { type: String },
            stock: { type: Number, default: 0 }
        }],
    },
    {
        timestamps: true,
    }
);

productSchema.pre('validate', function() {
    if (this.name && !this.slug) {
        this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    
    // Calculate sale price if discount is provided
    if (this.discount > 0 && this.price > 0) {
        this.salePrice = this.price - (this.price * (this.discount / 100));
    } else {
        this.salePrice = this.price;
    }
});

module.exports = mongoose.model("Product", productSchema);
