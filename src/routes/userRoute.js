const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();

const {
  createUser,
  login,
  updateUser,
} = require("../controllers/user.controller");

router.post("/", createUser);
router.post("/login", login);
router.put("/", auth, updateUser);

module.exports = router;
