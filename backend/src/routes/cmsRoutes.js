const express = require("express");
const router = express.Router();
const {
    getBanners,
    createBanner,
    updateBanner,
    deleteBanner,
    getSettings,
    updateSettings
} = require("../controllers/cmsController");
const { protect, admin } = require("../middleware/authMiddleware");

// Settings
router.route("/settings")
    .get(getSettings)
    .put(protect, admin, updateSettings);

// Banners
router.route("/banners")
    .get(getBanners)
    .post(protect, admin, createBanner);
    
router.route("/banners/:id")
    .put(protect, admin, updateBanner)
    .delete(protect, admin, deleteBanner);

module.exports = router;
