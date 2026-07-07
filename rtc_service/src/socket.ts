import { Server } from "socket.io";

const caches = new Map<string, string>();

function rtcServer(httpServer: any) {
  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    socket.on("subscribe", (data) => {
      caches.set(data.userId, socket.id);
      console.log(`${caches.get(data.userId)}:${data.userId}`);
    });

    socket.on("message:private:send", (data: IMessage) => {
      console.log(data);
      const receiverSocketId = caches.get(data.receiverId);
      if (receiverSocketId) {
        console.log(receiverSocketId);
        socket.to(receiverSocketId).emit("message:private:receive", data);
      }
    });

    socket.on("disconnect", (reason) => {
      console.log(`❌ Client disconnected (${socket.id}): ${reason}`);
    });
  });

  return io;
}

export default rtcServer;
