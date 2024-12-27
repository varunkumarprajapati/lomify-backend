const { HttpError } = require("http-errors");

async function error(error, req, res, next) {
  if (error instanceof HttpError) {
    return res
      .status(error.status)
      .send({ error: error.name, message: error.message });
  }

  if (error.code == 11000) {
    return res.status(409).send({
      error: "Conflict",
      message: `Duplicate value for field "${
        Object.keys(error.keyValue)[0]
      }". Please use a unique value.`,
    });
  }

  return res
    .status(500)
    .send({ error: "Internal Server Error", message: error.message });
}

module.exports = error;
