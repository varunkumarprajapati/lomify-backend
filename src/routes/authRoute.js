const router = require("express").Router();
const {
  createUser,
  confirmEmail,
  login,
  logout,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth.controller.js");

const auth = require("../middleware/auth.js");

router.post("/register", createUser);
router.get("/confirm-email/:token", confirmEmail);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.get("/logout", auth, logout);

module.exports = router;
