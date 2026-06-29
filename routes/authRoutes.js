const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
    getProfile,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.get("/profile", protect, getProfile);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;