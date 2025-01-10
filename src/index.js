require("./database/db.js");
require("dotenv").config();
require("express-async-errors");

const express = require("express");
const { createServer } = require("node:http");

// socket
const socket = require("./socket.js");

// Routes
const userRoute = require("./routes/userRoute.js");
const verificationRoute = require("./routes/verificationRoute.js");

// middlewares
const cors = require("cors");
const error = require("./middleware/error.js");

const app = express();
const server = createServer(app);
socket(server);

app.use(express.json());
app.use(
  cors({
    origin: [process.env.FRONTEND_DOMAIN],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Home page");
});

app.use("/api/users", userRoute);
app.use("/api/verification", verificationRoute);

app.use(error);

server.listen(process.env.PORT, () => {
  console.log(`Server running at : ${process.env.DOMAIN}`);
});
