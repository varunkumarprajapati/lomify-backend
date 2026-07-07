import "dotenv/config";
import server from "./server.js";
import connectDB from "./config/db.js";
import transporter from "./modules/email/transporter.js";

const PORT = process.env.PORT;

async function main() {
  try {
    await connectDB();
    server.listen(PORT, async () => {
      console.log(`Listening at port ${PORT}`);
      await transporter.verify();
      console.log("Mail Service is working");
    });
  } catch (error) {
    console.error(`[INDEX FILE ERROR]: ${error}`);
  }
}

main();
