const express = require("express");
const path = require("path");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cartRoutes = require("./routes/cartRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const cmsRoutes = require("./routes/cmsRoutes");
const couponRoutes = require("./routes/couponRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const faqRoutes = require("./routes/faqRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const contactRoutes = require("./routes/contactRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

const connectDB = require("./config/db");

app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Ensure Database is connected for Serverless Functions
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error("Database connection failed:", error);
        res.status(500).json({ message: "Database connection failed", error: error.message });
    }
});

app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/cms", cmsRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/contact", contactRoutes);

// Make uploads folder static
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", (req, res) => {
    res.send("Backend is Running 🚀");
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;