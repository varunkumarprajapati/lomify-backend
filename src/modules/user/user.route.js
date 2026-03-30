const router = require("express").Router();
const auth = require("../../middleware/auth.middleware");
const authController = require("./user.controller");

router.get("/", auth, authController.getUser);
router.put("/", auth, authController.updateUser);
router.delete("/", auth, authController.deleteUser);

module.exports = router;
