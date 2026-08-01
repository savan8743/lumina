const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

// @desc    Get dashboard analytics
// @route   GET /api/dashboard/analytics
// @access  Private/Admin
const getDashboardAnalytics = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const totalCustomers = await User.countDocuments({ role: 'user' });
        const totalProducts = await Product.countDocuments();

        // Calculate Total Revenue from paid orders
        const revenueAggregate = await Order.aggregate([
            { $match: { isPaid: true } },
            { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } }
        ]);
        const totalRevenue = revenueAggregate.length > 0 ? revenueAggregate[0].totalRevenue : 0;

        // Recent Orders
        const recentOrders = await Order.find({})
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(5);

        // Low Stock Alert
        const lowStockProducts = await Product.find({ stock: { $lt: 10 } })
            .select('name stock slug')
            .limit(5);

        // Best Sellers based on number of reviews for now (in real app, track sold count)
        const bestSellers = await Product.find({ isBestSeller: true })
            .select('name image price rating numReviews')
            .sort({ numReviews: -1 })
            .limit(5);

        res.json({
            stats: {
                totalOrders,
                totalCustomers,
                totalProducts,
                totalRevenue
            },
            recentOrders,
            lowStockProducts,
            bestSellers
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDashboardAnalytics
};
