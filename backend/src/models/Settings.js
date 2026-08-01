const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
    {
        websiteName: { type: String, default: "Lumina Naturals" },
        logo: { type: String, default: "" },
        favicon: { type: String, default: "" },
        
        contactDetails: {
            email: { type: String, default: "support@protin.com" },
            phone: { type: String, default: "" },
            address: { type: String, default: "" }
        },
        
        socialLinks: {
            facebook: { type: String, default: "" },
            instagram: { type: String, default: "" },
            twitter: { type: String, default: "" }
        },
        
        seoSettings: {
            metaTitle: { type: String, default: "Protin - Premium Supplements" },
            metaDescription: { type: String, default: "Shop premium whey isolate and pre-workout." }
        },
        
        storeConfig: {
            currency: { type: String, default: "USD" },
            currencySymbol: { type: String, default: "$" },
            shippingCharge: { type: Number, default: 0 },
            freeShippingThreshold: { type: Number, default: 100 },
            taxRate: { type: Number, default: 0 } // percentage
        },
        
        maintenanceMode: { type: Boolean, default: false }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Settings", settingsSchema);
