const { Redis } = require("ioredis");

const redisConfig = {
  maxRetriesPerRequest: null,
  lazyConnect: true,
};

const redis = new Redis(process.env.REDIS_URL, redisConfig);

redis.on("connect", () => console.log("Redis connected successfully"));
redis.on("error", (e) => console.log(`Redis Error: ${e}`));

module.exports = { redis, redisConfig };
