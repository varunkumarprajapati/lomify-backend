require("./database/db.js");
require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

const userRoute = require("./routes/userRoute.js");
const error = require("./middleware/error.js");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Home page");
});

app.use("/api/users", userRoute);

app.use(error);

app.listen(process.env.PORT, () => {
  console.log("Listing at port no:", process.env.PORT);
});
