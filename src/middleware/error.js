const { HttpError } = require("http-errors");
const {
  JsonWebTokenError,
  TokenExpiredError,
  NotBeforeError,
} = require("jsonwebtoken");

async function error(error, req, res, next) {
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

  //Mongoose Error
  if (error.code == 11000) {
    return res.status(409).send({
      error: "Conflict",
      message: `Duplicate value for field "${
        Object.keys(error.keyValue)[0]
      }". Please use a unique value.`,
    });
  }

  console.log("From middleware:", error);
  return res
    .status(500)
    .send({ error: "Internal Server Error", message: error.message });
}

module.exports = error;
