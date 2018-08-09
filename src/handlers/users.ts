import { RequestHandler } from 'express';
import Friendship from '../models/friendship';
import User from '../models/user';
import FriendshipPresenter from './presenters/friendshipPresenter';
import UserPresenter from './presenters/userPresenter';

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
 */
export const find: RequestHandler = async (req, res, next) => {
  const searchString = req.params.search_query || '';
  const pageNum = req.params.page || 0;

  try {
    const [currentUserFriendships, usersSearchResult] = await Promise.all([
      Friendship.findFriendshipsForUser(req.user._id),
      User.searchByText(searchString, PAGE_RESULTS_COUNT, pageNum),
    ]);

    return res.json({
      currentUserFriendships: currentUserFriendships.map(FriendshipPresenter.getData),
      foundUsers: usersSearchResult.users.map(UserPresenter.getData),
      itemsPerPage: PAGE_RESULTS_COUNT,
      totalItemsCount: usersSearchResult.totalCount,
    });
  } catch (err) {
    return next(err);
  }
};
