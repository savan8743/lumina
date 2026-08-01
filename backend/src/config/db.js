const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        return;
    }
    
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI environment variable is missing!");
    }

    try {
        const db = await mongoose.connect(process.env.MONGO_URI);
        isConnected = !!db.connections[0].readyState;
        console.log("✅ MongoDB Connected");
        return isConnected;
    } catch (error) {
        console.log("❌ Database Error:", error.message);
        throw error;
    }
};

module.exports = connectDB;