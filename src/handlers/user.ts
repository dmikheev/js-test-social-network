import { RequestHandler } from 'express';
import ApplicationError from '../errors/applicationError';
import User from '../models/user';
import UserPresenter from './presenters/userPresenter';

/**
 * Обработчик запроса на получение профиля пользователя.
 */

/**
 * В параметрах запроса берём id пользователя
 * или возвращаем профиль текущего авторизованного пользователя.
 */
export const getById: RequestHandler = async (req, res, next): Promise<any> => {
  const userId = req.params.user_id || req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(new ApplicationError('User not found', 404));
    }

    return res.json(UserPresenter.getData(user));
  } catch (err) {
    return next(err);
  }
};
