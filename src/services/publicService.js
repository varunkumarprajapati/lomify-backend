const User = require("../models/user.model");

exports.searchUsersByUsername = async (query) => {
  const users = await User.find(
    { username: { $regex: `^${query}`, $options: "i" } }, // case-insensitive prefix match
    "username name email avatar about",
  );
  return users;
};
