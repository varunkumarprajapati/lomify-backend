const User = require("../models/User");

exports.createUser = async (data) => {
  await User.create(data);
};

exports.login = async (data) => {
  const user = await User.findByCredentials(data);
  const token = user.generateAuthToken();

  return token;
};

exports.updateUser = async (_id, data) => {
  await User.updateOne({ _id }, data);
};

exports.deleteUser = async (_id) => {
  await User.deleteOne({ _id });
};
