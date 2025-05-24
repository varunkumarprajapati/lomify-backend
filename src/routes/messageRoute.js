const router = require("express").Router();
const {
  getConversation,
  getChatList,
} = require("../controllers/message.controller");

router.get("/", getConversation);
router.get("/chat-list", getChatList);

module.exports = router;
