const express = require("express");
const router = express.Router();
const upload = require("../utils/upload");
const { protect, admin } = require("../middleware/authMiddleware");

// @route   POST /api/upload
// @desc    Upload single image
// @access  Private/Admin
router.post("/", protect, admin, upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    res.json({
        message: "Image uploaded successfully",
        imageUrl: `/${req.file.path.replace(/\\/g, '/')}`,
    });
});

module.exports = router;
