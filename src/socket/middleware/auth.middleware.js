const cookie = require("cookie");
const jwt = require("jsonwebtoken");

function auth(socket, next) {
  try {
    const { access_token } = cookie.parse(socket.handshake.headers.cookie);
    const { _id } = jwt.verify(access_token, process.env.SECRET_KEY);
    socket.user = { _id };
    next();
  } catch (error) {
    next(new Error("Unauthorized"));
  }
}
module.exports = auth;
