const { Server } = require("socket.io");
const corsOptions = require("../config/cors");
const registerHandlers = require("./handlers");
const { connectUser, disconnectUser } = require("./services/user.service");
const auth = require("./middleware/auth.middleware");

function socket(server) {
  const io = new Server(server, {
    cors: corsOptions,
  });

  io.use(auth);

  io.on("connection", (socket) => {
    connectUser(socket.user._id, socket.id);

    registerHandlers(io, socket);

    socket.on("disconnect", () => {
      disconnectUser(socket.user._id);
    });
  });

  return io;
}

module.exports = socket;
