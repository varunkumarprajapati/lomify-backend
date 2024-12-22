require("dotenv").config();
const mongoose = require("mongoose");

main()
  .then(() => console.log("DB is connected..."))
  .catch((err) => console.error(err));

async function main() {
  await mongoose.connect(process.env.MONGODB_URL);
}
