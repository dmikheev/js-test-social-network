import { RequestHandler } from 'express';
import Friendship from '../models/friendship';

/**
 * Обработчик запроса на получение списка заявок и друзей
 */

export const getAll: RequestHandler = async (req, res, next) => {
  try {
    const friendships = await Friendship.getItemsForUser(req.user._id, true);

    return res.json(friendships);
  } catch (err) {
    return next(err);
  }
};
