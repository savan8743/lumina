const express = require("express");
const router = express.Router();
const { getDashboardAnalytics } = require("../controllers/dashboardController");
const { protect, admin } = require("../middleware/authMiddleware");

router.route("/analytics").get(protect, admin, getDashboardAnalytics);

module.exports = router;
