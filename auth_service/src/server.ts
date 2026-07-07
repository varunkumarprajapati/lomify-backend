import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const server = express();

import authRouter from "@/modules/auth/auth.route.js";
import userRouter from "@/modules/user/user.route.js";
import globalErrorHandler from "./middlewares/error.middleware.js";

const origins = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",") : [];

server.use(
  cors({
    origin(requestOrigin, callback) {
      if (!requestOrigin) return callback(null, true);
      if (origins.includes(requestOrigin)) return callback(null, true);
      return callback(new Error("CORS BLOCK"));
    },
    credentials: true,
  }),
);

server.use(cookieParser());
server.use(express.json());

server.get("/", (_, res) => res.json({ message: "ok" }));
server.use("/api/v1/auth", authRouter);
server.use("/api/v1/users", userRouter);

server.use(globalErrorHandler);

export default server;
