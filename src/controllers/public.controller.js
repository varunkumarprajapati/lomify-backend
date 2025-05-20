const publicService = require("../services/publicService");

exports.searchUsers = async (req, res) => {
  const users = await publicService.searchUsersByUsername(req.query.query);
  if (!users) return res.status(404).send();
  res.send(users);
};
