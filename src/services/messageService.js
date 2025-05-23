const Message = require("../models/Message");

exports.saveMessage = async (data) => {
  const message = await Message.create(data);
  return message;
};
