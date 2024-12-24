const User = require("../models/User");

exports.createUser = async (data) => {
  await User.create(data);
};
