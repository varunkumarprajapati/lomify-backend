const { updateUser, deleteUser } = require("./user.service");

exports.getUser = async (req, res) => {
  return res.json(req.user);
};

exports.updateUser = async (req, res) => {
  await updateUser(req.user?._id, req.body);
  res.status(204).send();
};

exports.deleteUser = async (req, res) => {
  await deleteUser(req.user._id);

  const isProd = process.env.NODE_ENV === "production" ? true : false;

  res.clearCookie("lomify_access_token", {
    httpOnly: true,
    sameSite: isProd ? "None" : "Lax",
    secure: true,
  });

  res.clearCookie("lomify_refresh_token", {
    httpOnly: true,
    sameSite: isProd ? "None" : "Lax",
    secure: true,
  });

  return res.json({ message: "user deleted successfully" });
};
