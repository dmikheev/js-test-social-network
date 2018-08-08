const UserPresenter = require('../handlers/presenters/userPresenter');
const WrongUserAcceptFriendshipError = require('../errors/wrongUserAcceptFriendshipError');
const WrongUserDeclineFriendshipError = require('../errors/wrongUserDeclineFriendshipError');

/**
 * Модель дружбы для mongoose
 */

const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.ObjectId;

/**
 * senderId - id пользователя, отправившего заявку
 * receiverId - id пользователя, которому отправлена заявка
 * accepted - подтверждена заявка или нет
 */
const friendshipSchema = mongoose.Schema({
  accepted: { type: Boolean, required: true },
  receiverId: { type: ObjectId, required: true, ref: 'User' },
  senderId: { type: ObjectId, required: true, ref: 'User' },
});

friendshipSchema.index({ senderId: 1 });
friendshipSchema.index({ receiverId: 1 });

friendshipSchema.methods.accept = function(acceptedUserId, cb) {
  if (this.receiverId !== acceptedUserId) {
    return cb(new WrongUserAcceptFriendshipError());
  }

  if (this.accepted) {
    return cb();
  }

  this.accepted = true;
  return this.save(cb);
};

friendshipSchema.methods.decline = function(declinedUserId, cb) {
  if (this.accepted) {
    if (!this.senderId.equals(declinedUserId) && !this.receiverId.equals(declinedUserId)) {
      return cb(new WrongUserDeclineFriendshipError());
    }

    if (this.receiverId.equals(declinedUserId)) {
      this.accepted = false;
      return this.save((err) => cb(err, this));
    } else {
      this.senderId = this.receiverId;
      this.receiverId = declinedUserId;
      this.accepted = false;

      return this.save((err) => cb(err, this));
    }
  } else {
    if (!this.senderId.equals(declinedUserId)) {
      return cb(new WrongUserDeclineFriendshipError());
    }

    return this.remove((err) => cb(err));
  }
};

/**
 * Получаем объект с заявками и друзьями пользователя
 * @param {ObjectId} userId - id пользователя, для которого получаем информацию
 * @param {Boolean} populate - требуется ли возвращать имя/фамилию друга
 * @param callback
 * Возвращаем объект с полями:
 *  - {Array} incoming - полученные заявки на дружбу
 *  - {Array} outcoming - отправленные заявки на дружбу
 *  - {Array} friends - подтверждённые заявки на дружбу
 */
friendshipSchema.statics.getItemsForUser = function(userId, populate, callback) {
  const senderQuery = this.find({ senderId: userId });

  if (populate) {
    senderQuery.populate('senderId', 'name lastname');
    senderQuery.populate('receiverId', 'name lastname');
  }

  senderQuery.exec((senderErr, senderResults) => {
    if (senderErr) {
      callback(senderErr);
      return;
    }

    const receiverQuery = this.find({ receiverId: userId });

    if (populate) {
      receiverQuery.populate('senderId', 'name lastname');
      receiverQuery.populate('receiverId', 'name lastname');
    }

    receiverQuery.exec(function(receiverErr, receiverResults) {
      if (receiverErr) {
        callback(receiverErr);
        return;
      }

      callback(receiverErr, constructResultForUser(senderResults, receiverResults));
    });
  });
};

const Friendship = mongoose.model('Friendship', friendshipSchema);
module.exports = Friendship;

/**
 * Собираем итоговый объект для функции getItemsForUser
 * @param {Array} senderResults - заявки, в которых пользователь является отправителем
 * @param {Array} receiverResults - заявки, в которых пользователь является получателем
 */
function constructResultForUser(senderResults, receiverResults) {
  const result = { incoming: [], outcoming: [], friends: [] };

  for (let i = 0; i < senderResults.length; i++) {
    if (senderResults[i].accepted) {
      result.friends.push(constructFriendshipResult(senderResults[i]));
    } else {
      result.outcoming.push(constructFriendshipResult(senderResults[i]));
    }
  }

  for (let i = 0; i < receiverResults.length; i++) {
    if (receiverResults[i].accepted) {
      result.friends.push(constructFriendshipResult(receiverResults[i]));
    } else {
      result.incoming.push(constructFriendshipResult(receiverResults[i]));
    }
  }

  return result;
}

function constructFriendshipResult(friendshipData) {
  return {
    accepted: friendshipData.accepted,
    id: friendshipData._id,
    receiver: UserPresenter.getData(friendshipData.receiverId),
    sender: UserPresenter.getData(friendshipData.senderId),
  };
}
