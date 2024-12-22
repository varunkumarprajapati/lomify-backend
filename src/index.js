require("./database/db.js");
require("dotenv").config();

const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Home page");
});

app.listen(process.env.PORT, () => {
  console.log("Listing at port no:", process.env.PORT);
});
