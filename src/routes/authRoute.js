const router = require("express").Router();
const {
  createUser,
  verifyEmail,
  login,
  logout,
  forgotPassword,
  resetPassword,
  googleAuth,
} = require("../controllers/auth.controller.js");

const auth = require("../middleware/auth.js");

router.post("/register", createUser);
router.get("/verify-email/:token", verifyEmail);
router.post("/login", login);
router.get("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.post("/logout", auth, logout);

// Google OAuth callback endpoint
router.post("/google", googleAuth);

module.exports = router;
