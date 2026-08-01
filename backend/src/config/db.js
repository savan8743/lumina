const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        return;
    }

    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI environment variable is missing!");
        }
        
        const db = await mongoose.connect(process.env.MONGO_URI);
        isConnected = !!db.connections[0].readyState;
        console.log("✅ MongoDB Connected");
    } catch (error) {
        console.log("❌ Database Error:", error.message);
        // Do not use process.exit(1) in production (Vercel) as it crashes the Serverless Function permanently
        if (process.env.NODE_ENV !== 'production') {
            process.exit(1);
        }
    }
};

module.exports = connectDB;