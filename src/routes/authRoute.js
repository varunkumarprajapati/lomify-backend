const router = require("express").Router();
const {
  createUser,
  verifyEmail,
  login,
  logout,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth.controller.js");

const auth = require("../middleware/auth.js");

router.post("/register", createUser);
router.get("/verify-email/:token", verifyEmail);
router.post("/login", login);
router.get("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.get("/logout", auth, logout);

module.exports = router;
