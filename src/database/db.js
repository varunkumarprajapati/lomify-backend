const mn = require("mongoose");

module.exports = {
  async connect() {
    console.info("Connecting Database...");
    if (!process.env.MONGO_URL) throw new Error("No Mongo URL");
    await mn.connect(process.env.MONGO_URL);
    console.log("Database Connected");
  },
};
