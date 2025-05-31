const messageService = require("../services/messageService");

exports.getChat = async (req, res) => {
  const conversation = await messageService.getChat(
    req.user._id,
    req.query.lastSync
  );
  res.send(conversation);
};

exports.getChatList = async (req, res) => {
  const chatList = await messageService.getChatList(req.user._id);
  res.send(chatList);
};
