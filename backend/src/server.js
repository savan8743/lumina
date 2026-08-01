require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

connectDB();

const PORT = process.env.PORT || 5000;

// Run the server normally in development
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Server Running on Port ${PORT}`);
    });
}

// Export for Vercel Serverless Functions
module.exports = app;