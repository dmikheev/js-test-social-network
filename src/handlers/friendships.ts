import { RequestHandler } from 'express';
import Friendship from '../models/friendship';
import FriendshipPresenter from './presenters/friendshipPresenter';
import UserPresenter from './presenters/userPresenter';

/**
 * Обработчик запроса на получение списка заявок и друзей
 */

export const getAll: RequestHandler = async (req, res, next) => {
  try {
    const { friendships, users } = await Friendship.findFriendshipsWithUsersForUser(req.user._id);

    return res.json({
      friendships: friendships.map(FriendshipPresenter.getData),
      users: users.map(UserPresenter.getData),
    });
  } catch (err) {
    return next(err);
  }
};
