const { Unauthorized } = require("http-errors");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function auth(req, res, next) {
  const token = req.cookies.access_token;
  if (!token) throw Unauthorized("Unauthorized");

  const { _id } = jwt.verify(token, process.env.SECRET_KEY);
  if (!_id) throw Unauthorized("Unauthorized");

  const user = await User.findById(_id);
  if (!user) throw Unauthorized("Session expired");

  req.user = user;

  next();
}

module.exports = auth;
