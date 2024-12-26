require("dotenv").config();
const { Unauthorized } = require("http-errors");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function auth(req, res, next) {
  const token = req.header("cookie")?.replace("session=", "");
  if (!token) throw Unauthorized("Session expired !!!");

  const { _id } = jwt.verify(token, process.env.SECRET_KEY);
  if (!_id) throw Unauthorized("Session expired !!!");

  const user = await User.findById(_id);
  req.user = user;

  next();
}

module.exports = auth;
