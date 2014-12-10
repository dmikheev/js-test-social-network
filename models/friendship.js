/**
 * Модель дружбы для mongoose
 */

var mongoose = require('mongoose');

var ObjectId = mongoose.Schema.ObjectId;

/**
 * senderId - id пользователя, отправившего заявку
 * receiverId - id пользователя, которому отправлена заявка
 * accepted - подтверждена заявка или нет
 */
var friendshipSchema = mongoose.Schema({
  senderId: { type: ObjectId, required: true, ref: 'User' },
  receiverId: { type: ObjectId, required: true, ref: 'User' },
  accepted: { type: Boolean, required: true }
});

friendshipSchema.index({ senderId: 1 });
friendshipSchema.index({ receiverId: 1 });

/**
 * Получаем объект с заявками и друзьями пользователя
 * @param {ObjectId} userId - id пользователя, для которого получаем информацию
 * @param {Boolean} populate - требуется ли возвращать имя/фамилию друга
 * Возвращаем объект с полями:
 *  - {Array} incoming - полученные заявки на дружбу
 *  - {Array} outcoming - отправленные заявки на дружбу
 *  - {Array} friends - подтверждённые заявки на дружбу
 */
friendshipSchema.statics.getItemsForUser = function(userId, populate, callback) {
  var self = this;
  var senderQuery = this.find({ senderId: userId });

  if (populate) {
    senderQuery.populate('receiverId', 'name lastname');
  }

  senderQuery.exec(function(err, senderResults) {
    if (err) {
      callback(err);
      return;
    }

    var receiverQuery = self.find({ receiverId: userId });

    if (populate) {
      receiverQuery.populate('senderId', 'name lastname');
    }

    receiverQuery.exec(function(err, receiverResults) {
      if (err) {
        callback(err);
        return;
      }

      callback(err, constructResultForUser(senderResults, receiverResults));
    });
  });
};

module.exports = mongoose.model('Friendship', friendshipSchema);

/**
 * Собираем итоговый объект для функции getItemsForUser
 * @param {Array} senderResults - заявки, в которых пользователь является отправителем
 * @param {Array} receiverResults - заявки, в которых пользователь является получателем
 */
function constructResultForUser(senderResults, receiverResults) {
  var result = { incoming: [], outcoming: [], friends: [] };

  for (var i = 0; i < senderResults.length; i++) {
    if (senderResults[i].accepted) {
      result.friends.push(senderResults[i]);
    } else {
      result.outcoming.push(senderResults[i]);
    }
  };

  for (var i = 0; i < receiverResults.length; i++) {
    if (receiverResults[i].accepted) {
      result.friends.push(receiverResults[i]);
    } else {
      result.incoming.push(receiverResults[i]);
    }
  };

  return result;
}