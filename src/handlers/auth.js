const UserPresenter = require('./presenters/userPresenter');

/**
 * Обработка запроса на логин или регистрацию
 */
const passport = require('passport');

const User = require('../models/user').default;

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
function auth(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }

    if (!user) {
      if (info.userFound) {
        return res.status(401).json({ error: { message: info.message } });
      } else {
        return registerUser(req, res, next);
      }
    }

    return loginUser(req, res, user, next);
  })(req, res, next);
}

/**
 * Регистрируем пользователя
 */
function registerUser(req, res, next) {
  const user = new User({
    lastname: req.body.lastname,
    login: req.body.login,
    name: req.body.name,
    pass: req.body.pass,
    regDate: new Date(),
  });

  user.save(function(err) {
    return err ? next(err) : loginUser(req, res, user, next, true);
  });
}

/**
 * Логиним пользователя и меняем его имя/фамилию, если они указаны
 * и пользователь не только что зарегистрирован.
 * В ответе отправляем тип проведённой операции.
 */
function loginUser(req, res, user, next, isJustRegistered) {
  req.logIn(user, function(loginErr) {
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

    user.save(function(saveErr) {
      return saveErr ? next(saveErr) : res.json({
        operation: RESULT_TYPE.LOGIN,
        user: UserPresenter.getData(user),
      });
    });
  });
}

module.exports = auth;
