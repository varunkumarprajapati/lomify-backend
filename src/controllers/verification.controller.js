require("dotenv").config();
const jwt = require("jsonwebtoken");
const { sendVerificationMail } = require("../utils/sendMail");
const { NotFound, BadRequest } = require("http-errors");
const { findUserById } = require("../services/userService");

exports.verifyUser = async (req, res) => {
  const { token } = req.params;

  const { _id } = jwt.verify(token, process.env.SECRET_KEY);

  const user = await findUserById(_id);
  if (!user) throw NotFound("User not found.");

  if (user.verified) throw BadRequest("User already verified.");

  user.verified = true;
  await user.save();

  return res.send({ message: "Email verified successfully." });
};

exports.resendVerifyMail = async (req, res) => {
  const { token } = req.params;
  const { _id } = jwt.decode(token);

  const user = await findUserById(_id);

  const link = await user.generateVerificationLink();
  await sendVerificationMail(user, link);

  res.send({ message: "Email is sent again." });
};
