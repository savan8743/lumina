const Cart = require("../models/Cart");

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id }).populate('coupon');
        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [] });
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Sync cart items (add, update, remove)
// @route   PUT /api/cart
// @access  Private
const syncCart = async (req, res) => {
    try {
        const { items } = req.body;
        
        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [] });
        }

        cart.items = items;
        
        // Recalculate totals
        const itemsPrice = cart.items.reduce((acc, item) => acc + item.price * item.qty, 0);
        cart.subTotal = itemsPrice;
        
        // Simple logic for discount (if coupon applied)
        cart.totalPrice = cart.subTotal - cart.discountAmount;

        const updatedCart = await cart.save();
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (cart) {
            cart.items = [];
            cart.subTotal = 0;
            cart.discountAmount = 0;
            cart.totalPrice = 0;
            cart.coupon = null;
            await cart.save();
        }
        res.json({ message: "Cart cleared" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCart,
    syncCart,
    clearCart
};
