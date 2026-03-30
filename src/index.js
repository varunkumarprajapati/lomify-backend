require("dotenv").config();
require("express-async-errors");

const db = require("./database/db");
const app = require("./app");
const socket = require("./socket");

async function main() {
  await db.connect();
  socket(app.listen(process.env.PORT));
}

if (require.main == module) main();
else process.exit(1);
