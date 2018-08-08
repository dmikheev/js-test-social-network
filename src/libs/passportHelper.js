/**
 * Настройка библиотеки passport
 */

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('./../models/user').default;

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
  passport.use(new LocalStrategy(
    {
      passwordField: 'pass',
      usernameField: 'login',
    },
    async function(login, pass, done) {
      try {
        const user = await User.findOne({ login });

        if (!user) {
          return done(null, false, { userFound: false });
        }

        const isPassMatched = await user.comparePass(pass);
        return isPassMatched ?
          done(null, user) :
          done(null, false, {
            message: 'Invalid password',
            userFound: true,
          });
      } catch (err) {
        return done(err);
      }
    },
  ));
}

/** Middleware для проверки авторизации. При ошибке возвращаем код 401. */
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.status(401).json({ error: { message: 'Authorization required.' } });
}

module.exports = {
  ensureAuthenticated: ensureAuthenticated,
  init: init,
};
