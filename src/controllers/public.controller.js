const User = require("../models/User");

exports.getUsers = async (req, res) => {
  const { username } = req.body;
  const users = await User.findOne(
    { username },
    "username name email avatar about"
  );

  if (!users) return res.send({ message: "No user found." });
  res.send(users);
};
