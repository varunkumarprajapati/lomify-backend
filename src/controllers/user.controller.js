const { createUser } = require("../services/userService");

exports.createUser = async (req, res) => {
  await createUser(req.body);
  res.status(204).send();
};
