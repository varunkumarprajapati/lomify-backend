import express from "express";
import cors from "cors";
const server = express();

import globalErrorHandler from "./middlewares/error.middleware.js";
import { createServer } from "node:http";

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

server.use(express.json());

server.get("/rtc-health", (_, res) => res.json({ message: "ok" }));
server.use(globalErrorHandler);

const mainServer = createServer(server);
export default mainServer;
