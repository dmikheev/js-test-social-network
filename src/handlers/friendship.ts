import { RequestHandler } from 'express';
import ApplicationError from '../errors/applicationError';
import Friendship from '../models/friendship';
import User from '../models/user';
import FriendshipPresenter from './presenters/friendshipPresenter';

/**
 * Обработчики запросов на добавление в друзья,
 * подтверждение и удаление дружбы
 */

/**
 * Заявка на добавление в друзья.
 * В параметрах запроса берём id пользователя, к которому добавляемся.
 */
export const request: RequestHandler = async (req, res, next) => {
  const senderId = req.user._id;
  const receiverId = req.params.user_id;

  if (senderId.equals(receiverId)) {
    return next(new ApplicationError('You cannot request friendship with yourself!', 400));
  }

  try {
    const user = await User.findById(receiverId);
    if (!user) {
      return next(new ApplicationError('Receiving user not found', 404));
    }

    const friendship = await Friendship.findOne({ senderId, receiverId });
    if (friendship) {
      return res.json(FriendshipPresenter.getData(friendship));
    }

    const newFriendship = new Friendship({
      accepted: false,
      receiverId: user._id,
      senderId: req.user._id,
    });

    await newFriendship.save();

    return res.json(FriendshipPresenter.getData(newFriendship));
  } catch (err) {
    return next(err);
  }
};

/**
 * Подтверждение дружбы.
 * В параметрах запроса берём id дружбы, которую подтверждаем.
 */
export const accept: RequestHandler = async (req, res, next) => {
  const friendshipId = req.params.friendship_id;

  try {
    const friendship = await Friendship.findById(friendshipId);
    if (!friendship) {
      return next(new ApplicationError('Friendship not found', 404));
    }

    await friendship.accept(req.user.id);
    return res.json(FriendshipPresenter.getData(friendship));
  } catch (err) {
    return next(err);
  }
};

/**
 * Отклонение заявки на дружбу.
 * В параметрах запроса берём id дружбы, которую отклоняем.
 */
export const decline: RequestHandler = async (req, res, next) => {
  const friendshipId = req.params.friendship_id;

  try {
    const friendship = await Friendship.findById(friendshipId);
    if (!friendship) {
      return next(new ApplicationError('Friendship not found', 404));
    }

    const newFriendshipData = await friendship.decline(req.user.id);
    return res.json({
      friendship: newFriendshipData ? FriendshipPresenter.getData(newFriendshipData) : undefined,
      isDeleted: !newFriendshipData,
    });
  } catch (err) {
    return next(err);
  }
};
