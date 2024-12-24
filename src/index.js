require("./database/db.js");
require("dotenv").config();

const express = require("express");
const app = express();

const userRoute = require("./routes/userRoute.js");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Home page");
});

app.use("/api/users", userRoute);

app.listen(process.env.PORT, () => {
  console.log("Listing at port no:", process.env.PORT);
});
