const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();

const {
  createUser,
  login,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller");

router.post("/", createUser);
router.post("/login", login);
router.put("/", auth, updateUser);
router.delete("/", auth, deleteUser);

module.exports = router;
