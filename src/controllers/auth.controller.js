const {
  createUser,
  confirmEmail,
  login,
  logout,
  forgotPassword,
  resetPassword,
} = require("../services/authService");

exports.createUser = async (req, res) => {
  await createUser(req.body);
  res.status(204).send();
};
exports.confirmEmail = async (req, res) => {
  await confirmEmail(req.params.token);
  res.status(204).send();
};
exports.login = async (req, res) => {
  const { token } = await login(req.body);

  res.cookie("access_token", token, {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });

  res.status(204).send();
};
exports.logout = async (req, res) => {
  await logout(req.user._id);

  res.clearCookie("access_token", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });

  res.status(204).send();
};
exports.forgotPassword = async (req, res) => {
  await forgotPassword(req.body.email);
  res.status(204).send();
};
exports.resetPassword = async (req, res) => {
  await resetPassword(req.params.token, req.body.password);
  res.status(204).send();
};
