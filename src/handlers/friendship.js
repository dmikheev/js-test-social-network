const User = require('../models/user');
const Friendship = require('../models/friendship');
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
  const senderId = req.user._id;
  const receiverId = req.params.user_id;

  if (senderId === receiverId) {
    return res.status(422).json({
      error: { message: 'You cannot request friendship with yourself!' },
    });
  }

  User.findById(receiverId, function(userFindErr, user) {
    if (userFindErr) {
      return next(userFindErr);
    }

    if (!user) {
      return res.status(422).json({
        error: { message: 'Receiving user not found' },
      });
    }

    Friendship.findOne(
      { senderId: senderId, receiverId: receiverId },
      function(friendshipFindErr, friendship) {
        if (friendshipFindErr) {
          return next(friendshipFindErr);
        }

        if (friendship) {
          res.status(422).json({
            error: { message: 'Friendship already exists' },
          });
          return;
        }

        const newFriendship = new Friendship({
          accepted: false,
          receiverId: user,
          senderId: req.user,
        });

        newFriendship.save(function(saveErr) {
          return saveErr ? next(saveErr) : res.json(FriendshipPresenter.getData(newFriendship));
        });
      });
  });
}

/**
 * Подтверждение дружбы.
 * В параметрах запроса берём id дружбы, которую подтверждаем.
 */
function accept(req, res, next) {
  const friendshipId = req.params.friendship_id;

  return Friendship.findById(friendshipId, function(findErr, friendship) {
    if (findErr) {
      return next(findErr);
    }

    if (!friendship) {
      return res.status(422).json({
        error: { message: 'Friendship not found' },
      });
    }

    return friendship.accept(req.user.id, (acceptErr) => {
      if (acceptErr) {
        if (acceptErr instanceof WrongUserAcceptFriendshipError) {
          return res.status(403).json({
            error: { message: 'User can\'t accept this request' },
          });
        }

        return next(acceptErr);
      }

      friendship.populate('senderId', 'name lastname');
      friendship.populate('receiverId', 'name lastname');
      return friendship.populate((populateErr) => {
        return populateErr ? next(populateErr) : res.json(FriendshipPresenter.getData(friendship));
      });
    });
  });
}

/**
 * Отклонение заявки на дружбу.
 * В параметрах запроса берём id дружбы, которую отклоняем.
 */
function decline(req, res, next) {
  const friendshipId = req.params.friendship_id;

  return Friendship.findById(friendshipId, function(findErr, friendship) {
    if (findErr) {
      return next(findErr);
    }

    if (!friendship) {
      return res.status(422).json({
        error: { message: 'Friendship not found' },
      });
    }

    return friendship.decline(req.user.id, (declineErr, newFriendshipData) => {
      if (declineErr) {
        if (declineErr instanceof WrongUserDeclineFriendshipError) {
          return res.status(403).json({
            error: { message: 'User can\'t decline this request' },
          });
        }

        return next(declineErr);
      }

      if (!newFriendshipData) {
        return res.status(204).send();
      }

      newFriendshipData.populate('senderId', 'name lastname');
      newFriendshipData.populate('receiverId', 'name lastname');
      return newFriendshipData.populate((populateErr) => {
        return populateErr ? next(populateErr) : res.json(FriendshipPresenter.getData(newFriendshipData));
      });
    });
  });
}

module.exports = {
  accept: accept,
  decline: decline,
  request: request,
};
