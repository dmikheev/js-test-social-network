/**
 * Настройка библиотеки passport
 */

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('./../models/user');

function init() {
  /** В cookie храним id пользователя */
  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  /** Для проверки авторизации получаем пользователя из базы по id из cookie */
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  /**
   * Проверяем пользователя по полям 'login' и 'pass'.
   * В callback передаём объект с полями:
   *  - {Boolean} userFound - найден ли пользователь по логину или нет
   *  - {String} message - сообщение об ошибке
   */
  passport.use(new LocalStrategy({
      usernameField: 'login',
      passwordField: 'pass'
    }, function(login, pass, done) {
      User.findOne({ login: login }, function(err, user) {
        if (err)
          return done(err);

        if (!user)
          return done(null, false, { userFound: false });

        user.comparePass(pass, function(err, isMatch) {
          if (err)
            return done(err);

          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, {
                userFound: true,
                message: 'Invalid password'
              });
          }
        });
      });
    }));
}

/** Middleware для проверки авторизации. При ошибке возвращаем код 401. */
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.status(401).json({ error: { message: 'Authorization required.' } });
}

module.exports = {
  init: init,
  ensureAuthenticated: ensureAuthenticated
};