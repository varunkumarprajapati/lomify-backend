const express = require("express");
const router = express.Router();
const {
  verifyUser,
  resendVerifyMail,
} = require("../controllers/verification.controller");

router.get("/email/:token", verifyUser);
router.get("/resend-email/:token", resendVerifyMail);

module.exports = router;
