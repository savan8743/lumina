const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        description: {
            type: String,
            default: "",
        },
        image: {
            type: String,
            default: "",
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active',
        },
        sortOrder: {
            type: Number,
            default: 0,
        }
    },
    {
        timestamps: true,
    }
);

// Pre-save middleware to automatically create slug from name if not provided
categorySchema.pre('validate', function() {
    if (this.name && !this.slug) {
        this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
});

module.exports = mongoose.model("Category", categorySchema);
