var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('./../models/user');

function init() {
  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

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

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.status(401).json({ error: { message: 'AUTH_REQUIRED' } });
}

module.exports = {
  init: init,
  ensureAuthenticated: ensureAuthenticated
};