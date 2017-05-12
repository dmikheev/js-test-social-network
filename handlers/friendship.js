var User = require('./../models/user');
var Friendship = require('./../models/friendship');
const FriendshipPresenter = require('./presenters/friendshipPresenter');
const WrongUserAcceptFriendshipError = require('../errors/wrongUserAcceptFriendshipError');
const WrongUserDeclineFriendshipError = require('../errors/wrongUserDeclineFriendshipError');

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

        const newFriendship = new Friendship({
          senderId: req.user,
          receiverId: user,
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

  return Friendship.findById(friendshipId, function(err, friendship) {
    if (err)
      return next(err);

    if (!friendship) {
      return res.status(422).json({
        error: { message: 'Friendship not found' }
      });
    }

    return friendship.accept(req.user.id, (err) => {
      if (err) {
        if (err instanceof WrongUserAcceptFriendshipError) {
          return res.status(403).json({
            error: { message: 'User can\'t accept this request' }
          });
        }

        return next(err);
      }

      friendship.populate('senderId', 'name lastname');
      friendship.populate('receiverId', 'name lastname');
      return friendship.populate((err) => {
        return err ? next(err) : res.json(FriendshipPresenter.getData(friendship));
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

  return Friendship.findById(friendshipId, function(err, friendship) {
    if (err)
      return next(err);

    if (!friendship) {
      return res.status(422).json({
        error: { message: 'Friendship not found' } 
      });
    }

    return friendship.decline(req.user.id, (err, newFriendshipData) => {
      if (err) {
        if (err instanceof WrongUserDeclineFriendshipError) {
          return res.status(403).json({
            error: { message: 'User can\'t decline this request' }
          });
        }

        return next(err);
      }

      if (!newFriendshipData) {
        return res.status(204).send();
      }

      newFriendshipData.populate('senderId', 'name lastname');
      newFriendshipData.populate('receiverId', 'name lastname');
      return newFriendshipData.populate((err) => {
        return err ? next(err) : res.json(FriendshipPresenter.getData(newFriendshipData));
      });
    });
  });
}

module.exports = {
  request: request,
  accept: accept,
  decline: decline
};
