require("./database/db.js");
require("dotenv").config();
require("express-async-errors");

const cors = require("cors");
const express = require("express");
const app = express();

const userRoute = require("./routes/userRoute.js");
const verificationRoute = require("./routes/verificationRoute.js");
const error = require("./middleware/error.js");

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:8000", "https://lomify-backend.vercel.app"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Home page");
});

app.use("/api/users", userRoute);
app.use("/api/verification", verificationRoute);

app.use(error);

app.listen(process.env.PORT, () => {
  console.log("Listing at port no:", process.env.PORT);
});
