const { sendVerificationMail } = require("../utils/sendMail");
const {
  createUser,
  login,
  updateUser,
  deleteUser,
} = require("../services/userService");

exports.createUser = async (req, res) => {
  const user = await createUser(req.body);
  const link = await user.generateVerificationLink();
  await sendVerificationMail(user, link);
  res.status(204).send();
};

exports.login = async (req, res) => {
  const token = await login(req.body);

  res.cookie("session", token);
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
