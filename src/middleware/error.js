const { HttpError } = require("http-errors");
const { JsonWebTokenError, TokenExpiredError } = require("jsonwebtoken");
const mongoose = require("mongoose");

async function error(error, req, res) {
  console.log(error);
  if (error instanceof HttpError) {
    return res
      .status(error.status)
      .send({ error: error.name, message: error.message });
  }

  // JWT errors
  if (error instanceof TokenExpiredError) {
    return res
      .status(401)
      .send({ error: "TokenExpiredError", message: "Token expired." });
  }
  if (error instanceof JsonWebTokenError) {
    return res.status(401).send({
      error: "JsonWebTokenError",
      message: "Invalid token. Please provide a valid token.",
    });
  }
  if (error instanceof TokenExpiredError) {
    return res
      .status(401)
      .send({ error: "TokenExpiredError", message: "Token expired." });
  }

  // Mongoose Error
  if (error instanceof mongoose.Error.ValidationError) {
    const message = Object.values(error.errors).map((e) => e.message)[0];
    return res.status(400).send({
      error: "ValidationError",
      message,
    });
  }

  if (error.code == 11000) {
    const field = Object.keys(error.keyValue)[0];
    return res.status(409).send({
      error: "DuplicateKeyError",
      message: `${field} already in use.`,
    });
  }

  return res.status(500).send({
    error: "Internal Server Error",
    message: error.message,
    error: error,
  });
}

module.exports = error;
