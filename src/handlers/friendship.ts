import { RequestHandler } from 'express';
import WrongUserAcceptFriendshipError from '../errors/wrongUserAcceptFriendshipError';
import WrongUserDeclineFriendshipError from '../errors/wrongUserDeclineFriendshipError';
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
    return res.status(400).json({
      error: { message: 'You cannot request friendship with yourself!' },
    });
  }

  try {
    const user = await User.findById(receiverId);
    if (!user) {
      return res.status(404).json({
        error: { message: 'Receiving user not found' },
      });
    }

    const friendship = await Friendship.findOne({ senderId, receiverId });
    if (friendship) {
      return res.status(400).json({
        error: { message: 'Friendship already exists' },
      });
    }

    const newFriendship = new Friendship({
      accepted: false,
      receiverId: user,
      senderId: req.user,
    });

    await newFriendship.save();

    return res.json(FriendshipPresenter.getDataOld(newFriendship));
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
      return res.status(404).json({
        error: { message: 'Friendship not found' },
      });
    }

    await friendship.accept(req.user.id);

    friendship.populate('senderId');
    friendship.populate('receiverId');
    await friendship.execPopulate();

    return res.json(FriendshipPresenter.getDataOld(friendship));
  } catch (err) {
    if (err instanceof WrongUserAcceptFriendshipError) {
      return res.status(403).json({
        error: { message: 'You cannot accept this request' },
      });
    }

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
      return res.status(404).json({
        error: { message: 'Friendship not found' },
      });
    }

    const newFriendshipData = await friendship.decline(req.user.id);
    if (!newFriendshipData) {
      return res.status(204).send();
    }

    newFriendshipData.populate('senderId');
    newFriendshipData.populate('receiverId');
    await newFriendshipData.execPopulate();

    return res.json(FriendshipPresenter.getDataOld(newFriendshipData));
  } catch (err) {
    if (err instanceof WrongUserDeclineFriendshipError) {
      return res.status(403).json({
        error: { message: 'You cannot decline this request' },
      });
    }

    return next(err);
  }
};
