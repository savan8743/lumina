const Order = require("../models/Order");
const Payment = require("../models/Payment");
const Product = require("../models/Product");
const Cart = require("../models/Cart");

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            discountPrice,
            totalPrice,
            razorpayOrderId,
            razorpayPaymentId,
            paymentReference,
            isPaid,
            paidAt
        } = req.body;

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: "No order items" });
        } else {
            const order = new Order({
                user: req.user._id,
                orderItems,
                shippingAddress,
                paymentMethod,
                itemsPrice,
                taxPrice,
                shippingPrice,
                discountPrice,
                totalPrice,
                razorpayOrderId,
                razorpayPaymentId,
                paymentReference,
                isPaid: isPaid || false,
                paidAt: paidAt || null
            });

            const createdOrder = await order.save();

            // Link payment to order
            if (paymentReference) {
                await Payment.findByIdAndUpdate(paymentReference, { order: createdOrder._id });
            }

            // Reduce stock
            for (const item of orderItems) {
                await Product.findByIdAndUpdate(item.product, {
                    $inc: { stock: -item.qty }
                });
            }

            // Clear Cart
            await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], subTotal: 0, totalPrice: 0 });

            res.status(201).json(createdOrder);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("user", "name email");

        if (order) {
            // Check if user is admin or the owner of the order
            if (req.user.role === 'admin' || req.user.role === 'superadmin' || order.user._id.toString() === req.user._id.toString()) {
                res.json(order);
            } else {
                res.status(403).json({ message: "Not authorized to view this order" });
            }
        } else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
                id: req.body.id,
                status: req.body.status,
                update_time: req.body.update_time,
                email_address: req.body.payer?.email_address,
            };

            order.timeline.push({
                status: 'Payment Confirmed',
                description: 'Payment has been successfully processed.'
            });

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate("user", "id name").sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status / tracking timeline
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    try {
        const { status, description } = req.body;
        const order = await Order.findById(req.params.id);

        if (order) {
            order.status = status;
            order.timeline.push({
                status,
                description: description || `Order status updated to ${status}`
            });

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    getMyOrders,
    getOrders,
    updateOrderStatus
};
