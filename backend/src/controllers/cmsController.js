const Banner = require("../models/Banner");
const Settings = require("../models/Settings");

// --- BANNER ENDPOINTS ---

// @desc    Get active banners
// @route   GET /api/cms/banners
// @access  Public
const getBanners = async (req, res) => {
    try {
        const position = req.query.position;
        const filter = { status: 'active' };
        if (position) filter.position = position;

        const banners = await Banner.find(filter).sort({ priority: -1, createdAt: -1 });
        res.json(banners);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create banner
// @route   POST /api/cms/banners
// @access  Private/Admin
const createBanner = async (req, res) => {
    try {
        const banner = await Banner.create(req.body);
        res.status(201).json(banner);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update banner
// @route   PUT /api/cms/banners/:id
// @access  Private/Admin
const updateBanner = async (req, res) => {
    try {
        const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (banner) res.json(banner);
        else res.status(404).json({ message: "Banner not found" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete banner
// @route   DELETE /api/cms/banners/:id
// @access  Private/Admin
const deleteBanner = async (req, res) => {
    try {
        const banner = await Banner.findByIdAndDelete(req.params.id);
        if (banner) res.json({ message: "Banner deleted" });
        else res.status(404).json({ message: "Banner not found" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- SETTINGS ENDPOINTS ---

// @desc    Get store settings
// @route   GET /api/cms/settings
// @access  Public
const getSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create({}); // Default settings if none exist
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update store settings
// @route   PUT /api/cms/settings
// @access  Private/Admin
const updateSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create(req.body);
        } else {
            settings = await Settings.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getBanners,
    createBanner,
    updateBanner,
    deleteBanner,
    getSettings,
    updateSettings
};
