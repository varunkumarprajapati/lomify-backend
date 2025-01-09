require("dotenv").config();
const { Server } = require("socket.io");

const users = {};

function socket(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_DOMAIN,
    },
  });

  io.on("connect", (socket) => {
    socket.on("subscribe", (_id) => {
      users[_id] = socket.id;

      console.log("Connected.");
      console.log(users);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected.");
      console.log(users);
    });
  });

  return io;
}

module.exports = socket;
