require("./database/db.js");
require("dotenv").config();
require("express-async-errors");

const express = require("express");
const cookieParser = require("cookie-parser");
const { createServer } = require("node:http");

// socket
const socket = require("./socket.js");

// Routes
const authRoute = require("./routes/authRoute.js");
const userRoute = require("./routes/userRoute.js");
const publicRoute = require("./routes/publicRoute.js");

// middlewares
const cors = require("cors");
const error = require("./middleware/error.js");

const app = express();
const server = createServer(app);
socket(server);

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: [process.env.FRONTEND_DOMAIN],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send(
    `<h1>Welcome To Lomify</h1><a href="${process.env.CLIENT_URL}">Go to Lomify</a>`
  );
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/public", publicRoute);

app.use(error);

server.listen(process.env.PORT);
