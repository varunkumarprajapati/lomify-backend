const { getUserSocket } = require("../services/user.service");

function chatHandler(io, socket) {
  socket.on("message:send", (data, ack) => {
    try {
      const receiverSocketId = getUserSocket(data.receiverId);
      io.to(receiverSocketId).emit("message:receive", {
        ...data,
        senderId: socket.user._id,
      });
      ack({ status: true });
    } catch (error) {
      ack({ status: false });
    }
  });
}
module.exports = chatHandler;
