var passport = require('passport');

var User = require('./../models/user');

function auth(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err)
      return next(err);

    if (!user) {
      if (info.userFound) {
        req.session.messages = [ info.message ];
        return res.send();
      } else {
        return registerUser(req, res, next);
      }
    }

    return loginUser(req, res, user, next);
  })(req, res, next);
}

function registerUser(req, res, next) {
  var user = new User({
    name: req.body.name,
    lastname: req.body.lastname,
    regDate: new Date(),
    login: req.body.login,
    pass: req.body.pass
  });

  user.save(function(err) {
    return err ? next(err) : loginUser(req, res, user, next);
  });
}

function loginUser(req, res, user, next) {
  req.logIn(user, function(err) {
    return err ? next(err) : res.send('OK');
  });
}

module.exports = auth;