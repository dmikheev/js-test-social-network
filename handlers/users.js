/**
 * Обработчик запроса на поиск пользователей
 */
var _ = require('underscore');

var User = require('./../models/user');
var Friendship = require('./../models/friendship');

/**
 * Количество пользователей на страницу
 */
var PAGE_RESULTS_COUNT = 10;

/**
 * Константы, обозначающие статус пользователя
 */
var USER_FRIENDSHIP_STATUS = {
  /** Текущий авторизованный пользователь */
  SELF: 0,

  /** Пользователь не в друзьях и без заявок */
  NONE: 1,

  /** От пользователя получена заявка */
  RECEIVED: 2,

  /** Пользователю отправлена заявка */
  REQUESTED: 3,

  /** Пользователь в списке друзей */
  FRIEND: 4
};

/**
 * В параметрах запроса берём строку поиска и номер страницы.
 * Если строка поиска не указана, возвращаем всех пользователей.
 * В объект каждого пользователя добавляем его статус и id дружбы (если есть).
 */
function find(req, res, next) {
  var searchString = req.params.search_query || '';
  var pageNum = req.params.page || 0;
  var query;

  if (searchString) {
    query = User
      .find(
        { $text: { $search: searchString } },
        {
          name: true,
          lastname: true,
          score: { $meta: 'textScore' }
        }
      )
      .sort({ score: { $meta: 'textScore' } });
  } else {
    query = User.find({}, 'name lastname');
  }
  
  query
    .skip(pageNum * PAGE_RESULTS_COUNT)
    .limit(PAGE_RESULTS_COUNT)
    .lean()
    .exec(function(err, users) {
      if (err)
        return next(err);

      Friendship.getItemsForUser(
        req.user._id,
        false,
        function(err, friendships) {
          if (err)
            return next(err);

          for (var i = users.length - 1; i >= 0; i--) {
            setUserFriendshipStatus(users[i], req.user, friendships);
          };

          return res.json(users);
        }
      );
    });
}

module.exports = {
  find: find
};

/**
 * Ищем пользователя в списках дружбы текущего пользователя
 * и проставляем статусы и id дружбы, где требуется.
 * @param {User} candidate - пользователь, которому нужно проставить статус
 * @param {User} mainUser - текущий авторизованный пользователь
 * @param friendships - объект содержащий списки дружбы из models/friendship.getItemsForUser
 */
function setUserFriendshipStatus(candidate, mainUser, friendships) {
  if (candidate._id == mainUser.id) {
    candidate.status = USER_FRIENDSHIP_STATUS.SELF;
    return;
  }

  var candidateId = candidate._id;
  var incomingFriendship = _.find(friendships.incoming, function(friendship) {
    return friendship.senderId.id == candidateId.id;
  });
  if (incomingFriendship) {
    candidate.status = USER_FRIENDSHIP_STATUS.RECEIVED;
    candidate.friendshipId = incomingFriendship._id;
    return;
  }
  
  var outcomingFriendship = _.find(friendships.outcoming, function(friendship) {
    return friendship.receiverId.id == candidateId.id;
  });
  if (outcomingFriendship) {
    candidate.status = USER_FRIENDSHIP_STATUS.REQUESTED;
    candidate.friendshipId = outcomingFriendship._id;
    return;
  }

  var friendFriendship = _.find(friendships.friends, function(friendship) {
    return friendship.senderId.id == candidateId.id ||
      friendship.receiverId.id == candidateId.id;
  });
  if (friendFriendship) {
    candidate.status = USER_FRIENDSHIP_STATUS.FRIEND;
    candidate.friendshipId = friendFriendship._id;
    return;
  }

  candidate.status = USER_FRIENDSHIP_STATUS.NONE;
}