const { Unauthorized } = require("http-errors");
const jwt = require("jsonwebtoken");
const { redis } = require("../database/redis");

const User = require("../models/user.model");

const auth = async (req, res, next) => {
  let accessToken = req.cookies.lomify_access_token;
  if (!accessToken) throw new Unauthorized("No Access Token Provided");

  const { sub, jti } = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
  const isActive = await redis.get(`sessions:access:${sub}:${jti}`);
  if (!isActive) throw Unauthorized("Session Expired");

  const key = `user:${sub}`;
  const cache = await redis.get(key);
  if (cache) {
    req.user = JSON.parse(cache);
  } else {
    const user = await User.findById(sub)
      .select("-password -isVerified")
      .lean();

    await redis
      .multi()
      .set(key, JSON.stringify(user))
      .expire(key, 86400)
      .exec();
    req.user = user;
  }
  req.user.jti = jti;
  next();
};

module.exports = auth;
