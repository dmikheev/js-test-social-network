var passport = require('passport');

var User = require('./../models/user');

var RESULT_TYPE_REGISTER = 'REGISTER';
var RESULT_TYPE_LOGIN = 'LOGIN';

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
    return err ? next(err) : loginUser(req, res, user, next, RESULT_TYPE_REGISTER);
  });
}

function loginUser(req, res, user, next, resultType) {
  req.logIn(user, function(err) {
    resultType = resultType || RESULT_TYPE_LOGIN;

    return err ? next(err) : res.json({ operation: resultType });
  });
}

module.exports = auth;