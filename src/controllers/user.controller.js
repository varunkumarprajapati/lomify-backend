const { Forbidden } = require("http-errors");
const { sendVerificationMail } = require("../utils/sendMail");
const {
  createUser,
  login,
  updateUser,
  deleteUser,
} = require("../services/userService");

exports.getUser = async (req, res) => {
  res.send(req.user);
};

exports.createUser = async (req, res) => {
  const user = await createUser(req.body);
  const link = await user.generateVerificationLink();
  await sendVerificationMail(user, link);
  res.status(204).send();
};

exports.login = async (req, res) => {
  const { user, token } = await login(req.body);
  if (!user.verified) {
    const link = await user.generateVerificationLink();
    await sendVerificationMail(user, link);
    throw Forbidden("Please verify your email.");
  }

  res.cookie("session", token, {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  res.status(204).send();
};

exports.updateUser = async (req, res) => {
  await updateUser(req.user?._id, req.body);
  res.status(204).send();
};

exports.deleteUser = async (req, res) => {
  await deleteUser(req.user._id);
  res.clearCookie("session");
  res.status(204).send();
};
