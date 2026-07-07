import "dotenv/config";
import server from "./server.js";
import connectDB from "./config/db.js";
import rtcServer from "./socket.js";

const PORT = process.env.PORT;

async function main() {
  try {
    await connectDB();
    const io = rtcServer(server);
    server.listen(PORT, async () => {
      console.log(`Listening at port ${PORT}`);
    });
  } catch (error) {
    console.error(`[INDEX FILE ERROR]: ${error}`);
  }
}

main();
