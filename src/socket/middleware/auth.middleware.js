const cookie = require("cookie");
const jwt = require("jsonwebtoken");

function auth(socket, next) {
  try {
    const { lomfiy_access_token } = cookie.parse(
      socket.handshake.headers.cookie,
    );
    const { sub } = jwt.verify(lomfiy_access_token, process.env.JWT_SECRET_KEY);
    socket.user = { sub };
    next();
  } catch (error) {
    next(new Error("Unauthorized"));
  }
}
module.exports = auth;
