/**
 * Обработчик запроса на поиск пользователей
 */
const _ = require('underscore');

const User = require('../models/user');
const Friendship = require('../models/friendship');
const UserPresenter = require('./presenters/userPresenter');
const USER_FRIENDSHIP_STATUS = require('./usersSearchFriendshipStatuses').SEARCH_USER_FRIENDSHIP_STATUSES;

/**
 * Количество пользователей на страницу
 */
const PAGE_RESULTS_COUNT = 10;

/**
 * В параметрах запроса берём строку поиска и номер страницы.
 * Если строка поиска не указана, возвращаем всех пользователей.
 * В объект каждого пользователя добавляем его статус и id дружбы (если есть).
 */
function find(req, res, next) {
  const searchString = req.params.search_query || '';
  const pageNum = req.params.page || 0;
  let query;

  if (searchString) {
    query = User
      .find(
        { $text: { $search: searchString } },
        {
          lastname: true,
          name: true,
          score: { $meta: 'textScore' },
        },
      )
      .sort({ score: { $meta: 'textScore' } });
  } else {
    query = User.find({}, 'name lastname');
  }

  query
    .skip(pageNum * PAGE_RESULTS_COUNT)
    .limit(PAGE_RESULTS_COUNT)
    .lean()
    .exec(function(findErr, users) {
      if (findErr) {
        return next(findErr);
      }

      Friendship.getItemsForUser(
        req.user._id,
        true,
        function(getItemsErr, friendships) {
          if (getItemsErr) {
            return next(getItemsErr);
          }

          for (let i = users.length - 1; i >= 0; i--) {
            setUserFriendshipStatus(users[i], req.user, friendships);
          }

          return res.json(users.map((user) => UserPresenter.getData(user, {
            friendshipId: user.friendshipId,
            status: user.status,
          })));
        },
      );
    });
}

module.exports = {
  find: find,
};

/**
 * Ищем пользователя в списках дружбы текущего пользователя
 * и проставляем статусы и id дружбы, где требуется.
 * @param {User} candidate - пользователь, которому нужно проставить статус
 * @param {User} mainUser - текущий авторизованный пользователь
 * @param friendships - объект содержащий списки дружбы из models/friendship.getItemsForUser
 */
function setUserFriendshipStatus(candidate, mainUser, friendships) {
  if (candidate._id === mainUser.id) {
    candidate.status = USER_FRIENDSHIP_STATUS.SELF;
    return;
  }

  const candidateId = candidate._id;
  const incomingFriendship = _.find(friendships.incoming, function(friendship) {
    return friendship.sender.id.id === candidateId.id;
  });
  if (incomingFriendship) {
    candidate.status = USER_FRIENDSHIP_STATUS.RECEIVED;
    candidate.friendshipId = incomingFriendship.id;
    return;
  }

  const outcomingFriendship = _.find(friendships.outcoming, function(friendship) {
    return friendship.receiver.id.id === candidateId.id;
  });
  if (outcomingFriendship) {
    candidate.status = USER_FRIENDSHIP_STATUS.REQUESTED;
    candidate.friendshipId = outcomingFriendship.id;
    return;
  }

  const friendFriendship = _.find(friendships.friends, function(friendship) {
    return friendship.sender.id.id === candidateId.id ||
      friendship.receiver.id.id === candidateId.id;
  });
  if (friendFriendship) {
    candidate.status = USER_FRIENDSHIP_STATUS.FRIEND;
    candidate.friendshipId = friendFriendship.id;
    return;
  }

  candidate.status = USER_FRIENDSHIP_STATUS.NONE;
}
