const router = require("express").Router();
const { getChat, getChatList } = require("../controllers/message.controller");

router.get("/", getChat);
router.get("/chat-list", getChatList);

module.exports = router;
