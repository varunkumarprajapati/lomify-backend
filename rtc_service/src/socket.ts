import { Server } from "socket.io";

function rtcServer(httpServer: any) {
  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log(`🚀 Client connected: ${socket.id}`);

    socket.on("ping-server", (data) => {
      console.log(`Received data from client:`, data);

      socket.emit("pong-client", { message: "Hello from RTC Server!" });
    });

    socket.on("disconnect", (reason) => {
      console.log(`❌ Client disconnected (${socket.id}): ${reason}`);
    });
  });

  return io;
}

export default rtcServer;
