const connectedUsers = new Map();

module.exports = {
  connectUser: (userId, socketId) => {
    connectedUsers.set(userId, socketId);
    console.log({ [userId]: socketId });
  },
  disconnectUser: (userId) => {
    connectedUsers.delete(userId);
  },
  getUserSocket: (userId) => {
    return connectedUsers.get(userId);
  },
  getConnectedUsers: () => {
    return Array.from(connectedUsers.keys());
  },
};
