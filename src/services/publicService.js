const User = require("../models/User");

exports.searchUsersByUsername = async (query) => {
  const users = await User.find(
    { username: { $regex: `^${query}`, $options: "i" } }, // case-insensitive prefix match
    "username name email avatar about"
  );
  return users;
};
