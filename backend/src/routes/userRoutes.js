const express = require("express");
const router = express.Router();
const { 
    registerUser, 
    loginUser, 
    getUserProfile, 
    updateUserProfile, 
    getUsers,
    createAdmin,
    updateUserStatus,
    forgotPassword,
    resetPassword
} = require("../controllers/userController");
const { protect, admin, superadmin } = require("../middleware/authMiddleware");

router.route("/").get(protect, admin, getUsers);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:token", resetPassword);
router.route("/profile")
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

router.post("/admin", protect, superadmin, createAdmin);
router.put("/:id/status", protect, superadmin, updateUserStatus);

module.exports = router;