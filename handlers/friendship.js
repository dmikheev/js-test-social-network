var User = require('./../models/user');
var Friendship = require('./../models/friendship');
const FriendshipPresenter = require('./presenters/friendshipPresenter');

  /**
 * Обработчики запросов на добавление в друзья,
 * подтверждение и удаление дружбы
 */

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
          return err ? next(err) : res.json(FriendshipPresenter.getData(newFriendship));
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
      return err ? next(err) : res.json(FriendshipPresenter.getData(friendship));
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

    if (friendship.receiverId === req.user.id) {
      friendship.accepted = false;
      friendship.save((err) => {
        return err ? next(err) : res.json(FriendshipPresenter.getData(friendship));
      });
    } else {
      friendship.senderId = friendship.receiverId;
      friendship.receiverId = req.user.id;
      friendship.accepted = false;

      friendship.save(function(err) {
        return err ? next(err) : res.json(FriendshipPresenter.getData(friendship));
      });
    }
  });
}

module.exports = {
  request: request,
  accept: accept,
  decline: decline
};
