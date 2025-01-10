require("dotenv").config();
const { Server } = require("socket.io");

const users = {};

function socket(server) {
  const io = new Server(server, {
    cors: {
      origin: [process.env.FRONTEND_DOMAIN],
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  io.on("connect", (socket) => {
    socket.on("subscribe", (_id) => {
      users[_id] = socket.id;

      console.log(socket.id, "is connected.");
      console.log(users);
    });

    socket.on("disconnect", () => {
      console.log(socket.id, "is disconnected.");
    });
  });

  return io;
}

module.exports = socket;
