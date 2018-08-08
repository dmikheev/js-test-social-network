import { RequestHandler } from 'express';
import lodashFind from 'lodash/find';
import Friendship from '../models/friendship';
import User, { IUserDocument } from '../models/user';
import UserPresenter from './presenters/userPresenter';
import { SEARCH_USER_FRIENDSHIP_STATUSES as USER_FRIENDSHIP_STATUS } from './usersSearchFriendshipStatuses';

/**
 * Обработчик запроса на поиск пользователей
 */

/**
 * Количество пользователей на страницу
 */
const PAGE_RESULTS_COUNT = 10;

/**
 * В параметрах запроса берём строку поиска и номер страницы.
 * Если строка поиска не указана, возвращаем всех пользователей.
 * В объект каждого пользователя добавляем его статус и id дружбы (если есть).
 */
export const find: RequestHandler = async (req, res, next) => {
  const searchString = req.params.search_query || '';
  const pageNum = req.params.page || 0;
  let query;

  if (searchString) {
    query = User
      .find(
        { $text: { $search: searchString } },
        { score: { $meta: 'textScore' } },
      )
      .sort({ score: { $meta: 'textScore' } });
  } else {
    query = User.find();
  }

  query
    .skip(pageNum * PAGE_RESULTS_COUNT)
    .limit(PAGE_RESULTS_COUNT)
    .lean();

  try {
    const users = await query.exec();
    const friendships = await Friendship.getItemsForUser(req.user._id, true);

    const filledUsers = users.map((user) => setUserFriendshipStatus(user, req.user, friendships));

    return res.json(filledUsers.map((user) => UserPresenter.getData(user, {
      friendshipId: user.friendshipId,
      status: user.status,
    })));
  } catch (err) {
    return next(err);
  }
};

/**
 * Ищем пользователя в списках дружбы текущего пользователя
 * и проставляем статусы и id дружбы, где требуется.
 * @param {User} candidate - пользователь, которому нужно проставить статус
 * @param {User} mainUser - текущий авторизованный пользователь
 * @param friendships - объект содержащий списки дружбы из models/friendship.getItemsForUser
 */
function setUserFriendshipStatus(candidate: IUserDocument, mainUser: IUserDocument, friendships: any): any {
  const result: any = Object.assign({}, candidate);

  if (result._id.equals(mainUser.id)) {
    result.status = USER_FRIENDSHIP_STATUS.SELF;
    return result;
  }

  const candidateId = result._id;
  const incomingFriendship = lodashFind(friendships.incoming, (friendship) => {
    return friendship.sender.id.equals(candidateId);
  });
  if (incomingFriendship) {
    result.status = USER_FRIENDSHIP_STATUS.RECEIVED;
    result.friendshipId = incomingFriendship.id;
    return result;
  }

  const outcomingFriendship = lodashFind(friendships.outcoming, (friendship) => {
    return friendship.receiver.id.equals(candidateId);
  });
  if (outcomingFriendship) {
    result.status = USER_FRIENDSHIP_STATUS.REQUESTED;
    result.friendshipId = outcomingFriendship.id;
    return result;
  }

  const friendFriendship = lodashFind(friendships.friends, (friendship) => {
    return friendship.sender.id.equals(candidateId) ||
      friendship.receiver.id.equals(candidateId);
  });
  if (friendFriendship) {
    result.status = USER_FRIENDSHIP_STATUS.FRIEND;
    result.friendshipId = friendFriendship.id;
    return result;
  }

  result.status = USER_FRIENDSHIP_STATUS.NONE;
  return result;
}
