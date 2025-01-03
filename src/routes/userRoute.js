const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();

const {
  createUser,
  login,
  updateUser,
  deleteUser,
  getUser,
} = require("../controllers/user.controller");

router.get("/", auth, getUser);
router.post("/", createUser);
router.post("/login", login);
router.put("/", auth, updateUser);
router.delete("/", auth, deleteUser);

module.exports = router;
