const mongoose = require("mongoose");

const contactMessageSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        message: { type: String, required: true },
        status: { 
            type: String, 
            enum: ['Unread', 'Read', 'Replied'],
            default: 'Unread' 
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("ContactMessage", contactMessageSchema);
