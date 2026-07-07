import { Redis } from "ioredis";

const redisClient = new Redis(process.env.REDIS_URL);

redisClient.on("connect", () => {
  console.log("Connected to Valkey/Redis");
});

redisClient.on("error", (err) => {
  console.error("Redis Connection Error:", err.message);
});

export default redisClient;
