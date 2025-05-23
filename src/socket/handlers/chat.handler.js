const { getUserSocket } = require("../services/user.service");
const { saveMessage } = require("../../services/messageService");
function chatHandler(io, socket) {
  socket.on("message:send", async ({ _id, ...data }, ack) => {
    try {
      let message = {
        ...data,
        senderId: socket.user._id,
      };

      const receiverSocketId = getUserSocket(data.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("message:receive", { ...message, _id });
        ack({ status: "received" });
      } else {
        ack({ status: "sent" });
      }

      message = await saveMessage(message);
      socket.emit("message:update-id", { tempId: _id, _id: message._id });
    } catch (error) {
      ack({ status: "failed" });
    }
  });
}
module.exports = chatHandler;
