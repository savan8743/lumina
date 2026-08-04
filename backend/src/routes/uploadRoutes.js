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
    const base64Image = req.file.buffer.toString('base64');
    const imageUrl = `data:${req.file.mimetype};base64,${base64Image}`;
    
    res.json({
        message: "Image uploaded successfully",
        imageUrl,
    });
});

module.exports = router;
