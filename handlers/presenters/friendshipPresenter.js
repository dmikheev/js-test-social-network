const UserPresenter = require('./userPresenter');

module.exports = {
  getData(friendship) {
    return {
      id: friendship._id,
      sender: UserPresenter.getData(friendship.senderId),
      receiver: UserPresenter.getData(friendship.receiverId),
      accepted: friendship.accepted,
    };
  },
};
