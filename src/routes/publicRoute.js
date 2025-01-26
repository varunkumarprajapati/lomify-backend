const router = require("express").Router();
const { getUsers } = require("../controllers/public.controller");

router.post("/users", getUsers);

module.exports = router;
