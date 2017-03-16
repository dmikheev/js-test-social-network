module.exports = {
  getData(friendship) {
    return {
      id: friendship._id,
      senderId: friendship.senderId,
      receiverId: friendship.receiverId,
      accepted: friendship.accepted,
    };
  },
};
