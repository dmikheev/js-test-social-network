const UserPresenter = require('./userPresenter');

module.exports = {
  getData(friendship) {
    return {
      accepted: friendship.accepted,
      id: friendship._id,
      receiver: UserPresenter.getData(friendship.receiverId),
      sender: UserPresenter.getData(friendship.senderId),
    };
  },
};
