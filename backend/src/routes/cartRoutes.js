const express = require("express");
const router = express.Router();
const {
    getCart,
    syncCart,
    clearCart
} = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");

router.route("/")
    .get(protect, getCart)
    .put(protect, syncCart)
    .delete(protect, clearCart);

module.exports = router;
