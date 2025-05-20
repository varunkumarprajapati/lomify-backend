const router = require("express").Router();
const { searchUsers } = require("../controllers/public.controller");

router.get("/search-users", searchUsers);

module.exports = router;
