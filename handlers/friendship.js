/**
 * Обработчики запросов на добавление в друзья,
 * подтверждение и удаление дружбы
 */
var User = require('./../models/user');
var Friendship = require('./../models/friendship');

/**
 * Заявка на добавление в друзья.
 * В параметрах запроса берём id пользователя, к которому добавляемся.
 */
function request(req, res, next) {
  var senderId = req.user._id;
  var receiverId = req.params.user_id;

  if (senderId == receiverId) {
    return res.status(422).json({
      error: { message: 'You cannot request friendship with yourself!' }
    });
  }

  User.findById(receiverId, function(err, user) {
    if (err)
      return next(err);

    if (!user) {
      return res.status(422).json({
        error: { message: 'Receiving user not found' }
      });
    }

    Friendship.findOne(
      { senderId: senderId, receiverId: receiverId },
      function(err, friendship) {
        if (err)
          return next(err);

        if (friendship) {
          res.status(422).json({
            error: { message: 'Friendship already exists' }
          });
          return;
        }

        var newFriendship = new Friendship({
          senderId: senderId,
          receiverId: receiverId,
          accepted: false
        });

        newFriendship.save(function(err) {
          return err ? next(err) : res.json({
            _id: newFriendship._id,
            senderId: newFriendship.senderId,
            receiverId: newFriendship.receiverId,
            accepted: newFriendship.accepted
          });
        });
      });
  });
}

/**
 * Подтверждение дружбы.
 * В параметрах запроса берём id дружбы, которую подтверждаем.
 */
function accept(req, res, next) {
  var friendshipId = req.params.friendship_id;

  Friendship.findById(friendshipId, function(err, friendship) {
    if (err)
      return next(err);

    if (!friendship) {
      return res.status(422).json({
        error: { message: 'Friendship not found' }
      });
    }
    if (friendship.receiverId != req.user.id) {
      return res.status(403).json({
        error: { message: 'You must be receiver to accept request' }
      });
    }

    friendship.accepted = true;
    friendship.save(function(err) {
      return err ? next(err) : res.json({
          _id: friendship._id,
          senderId: friendship.senderId,
          receiverId: friendship.receiverId,
          accepted: friendship.accepted
        });
    });
  });
}

/**
 * Отклонение заявки на дружбу.
 * В параметрах запроса берём id дружбы, которую отклоняем.
 */
function decline(req, res, next) {
  var friendshipId = req.params.friendship_id;

  Friendship.findById(friendshipId, function(err, friendship) {
    if (err)
      return next(err);

    if (!friendship) {
      return res.status(422).json({
        error: { message: 'Friendship not found' } 
      });
    }
    if (friendship.senderId != req.user.id &&
      friendship.receiverId != req.user.id) {
        return res.status(403).json({
          error: { message: 'You must be sender or receiver to decline request' }
        });
    }

    friendship.remove(function(err) {
      return err ? next(err) : res.status(204).send();
    });
  });
}

module.exports = {
  request: request,
  accept: accept,
  decline: decline
};