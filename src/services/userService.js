const User = require("../models/User");

exports.createUser = async (data) => {
  const user = await User.create(data);
  return user;
};

exports.updateUser = async (_id, data) => {
  await User.updateOne({ _id }, data);
};

exports.deleteUser = async (_id) => {
  await User.deleteOne({ _id });
};

exports.findUserById = async (_id) => {
  const user = await User.findById(_id);
  return user;
};
