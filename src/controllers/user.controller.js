const { updateUser, deleteUser } = require("../services/userService");

exports.getUser = async (req, res) => {
  res.send(req.user);
};

exports.updateUser = async (req, res) => {
  await updateUser(req.user?._id, req.body);
  res.status(204).send();
};

exports.deleteUser = async (req, res) => {
  await deleteUser(req.user._id);
  res.clearCookie("access_token", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  res.status(204).send();
};
