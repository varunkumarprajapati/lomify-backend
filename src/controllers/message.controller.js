const messageService = require("../services/messageService");

exports.getConversation = async (req, res) => {
  const conversation = await messageService.getConversation(req.user._id);
  res.send(conversation);
};

exports.getChatList = async (req, res) => {
  const chatList = await messageService.getChatList(req.user._id);
  res.send(chatList);
};
