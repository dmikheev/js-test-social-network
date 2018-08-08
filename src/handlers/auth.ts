import { NextFunction, Request, RequestHandler, Response } from 'express';
import passport from 'passport';
import User, { IUserDocument } from '../models/user';
import UserPresenter from './presenters/userPresenter';

/**
 * Обработка запроса на логин или регистрацию
 */

/**
 * Константы, обозначающие тип операции
 */
const RESULT_TYPE = {
  LOGIN: 'LOGIN',
  REGISTER: 'REGISTER',
};

/**
 * Проверяем результаты аутентификации
 */
const auth: RequestHandler = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      if (info) {
        return res.status(401).json({ error: { message: info.message } });
      }

      return registerUser(req, res, next);
    }

    return loginUser(req, res, user, next);
  })(req, res, next);
};
export default auth;

/**
 * Регистрируем пользователя
 */
async function registerUser(req: Request, res: Response, next: NextFunction) {
  const user = new User({
    lastname: req.body.lastname,
    login: req.body.login,
    name: req.body.name,
    pass: req.body.pass,
    regDate: new Date(),
  });

  try {
    await user.save();

    return loginUser(req, res, user, next, true);
  } catch (err) {
    return next(err);
  }
}

/**
 * Логиним пользователя и меняем его имя/фамилию, если они указаны
 * и пользователь не только что зарегистрирован.
 * В ответе отправляем тип проведённой операции.
 */
function loginUser(req: Request, res: Response, user: IUserDocument, next: NextFunction, isJustRegistered = false) {
  req.logIn(user, async (loginErr) => {
    if (loginErr) {
      return next(loginErr);
    }

    if (isJustRegistered) {
      return res.json({
        operation: RESULT_TYPE.REGISTER,
        user: UserPresenter.getData(user),
      });
    }

    let newName;
    if (req.body.name && req.body.name !== user.name) {
      newName = req.body.name;
    }

    let newLastname;
    if (req.body.lastname && req.body.lastname !== user.lastname) {
      newLastname = req.body.lastname;
    }

    if (!newName && !newLastname) {
      return res.json({
        operation: RESULT_TYPE.LOGIN,
        user: UserPresenter.getData(user),
      });
    }

    if (newName) {
      user.name = newName;
    }

    if (newLastname) {
      user.lastname = newLastname;
    }

    user.save((saveErr) => {
      return saveErr ? next(saveErr) : res.json({
        operation: RESULT_TYPE.LOGIN,
        user: UserPresenter.getData(user),
      });
    });
  });
}
