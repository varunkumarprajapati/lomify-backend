const chatHandler = require("./chat.handler");

function registerHandlers(io, socket) {
  chatHandler(io, socket);
}

module.exports = registerHandlers;
