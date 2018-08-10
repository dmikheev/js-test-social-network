/**
 * Настройка библиотеки passport
 */

import { RequestHandler } from 'express';
import passport from 'passport';
import passportLocal from 'passport-local';
import ApplicationError from '../errors/applicationError';
import User, { IUserDocument } from '../models/user';

const LocalStrategy = passportLocal.Strategy;

export function init() {
  /** В cookie храним id пользователя */
  passport.serializeUser<IUserDocument, any>((user, done) => {
    done(null, user._id);
  });

  /** Для проверки авторизации получаем пользователя из базы по id из cookie */
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user as any);
    });
  });

  /**
   * Проверяем пользователя по полям 'login' и 'pass'.
   * В callback передаём объект с полями:
   *  - {Boolean} userFound - найден ли пользователь по логину или нет
   *  - {String} message - сообщение об ошибке
   */
  passport.use(new LocalStrategy(
    {
      passwordField: 'pass',
      usernameField: 'login',
    },
    async (login, pass, done) => {
      try {
        const user = await User.findOne({ login });

        if (!user) {
          return done(null, false);
        }

        const isPassMatched = await user.comparePass(pass);
        return isPassMatched ?
          done(null, user) :
          done(null, false, { message: 'Invalid password' });
      } catch (err) {
        return done(err);
      }
    },
  ));
}

/** Middleware для проверки авторизации. При ошибке возвращаем код 401. */
export const ensureAuthenticated: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  return next(new ApplicationError('Authorization required.', 401));
};
