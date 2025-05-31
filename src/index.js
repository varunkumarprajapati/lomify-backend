require("./database/db.js");
require("dotenv").config();
require("express-async-errors");

const express = require("express");
const cookieParser = require("cookie-parser");

// Routes
const authRoute = require("./routes/authRoute.js");
const userRoute = require("./routes/userRoute.js");
const publicRoute = require("./routes/publicRoute.js");
const messageRoute = require("./routes/messageRoute.js");

// middlewares
const cors = require("cors");
const error = require("./middleware/error.js");
const auth = require("./middleware/auth.js");

const corsOption = require("./config/cors.js");

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOption));

app.get("/", (req, res) => {
  res.send(
    `<h1>Welcome To Lomify</h1><a href="${process.env.CLIENT_URL}">Go to Lomify</a>`
  );
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/public", publicRoute);
app.use("/api/messages", auth, messageRoute);

app.use(error);

require("./socket")(app.listen(process.env.PORT));
