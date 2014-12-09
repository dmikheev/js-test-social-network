var passport = require('passport');

var User = require('./../models/user');

var RESULT_TYPE = {
  REGISTER: 'REGISTER',
  LOGIN: 'LOGIN'
};

function auth(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err)
      return next(err);

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

function registerUser(req, res, next) {
  var user = new User({
    name: req.body.name,
    lastname: req.body.lastname,
    regDate: new Date(),
    login: req.body.login,
    pass: req.body.pass
  });

  user.save(function(err) {
    return err ? next(err) : loginUser(req, res, user, next, true);
  });
}

function loginUser(req, res, user, next, isJustRegistered) {
  req.logIn(user, function(err) {
    if (err)
      return next(err);

    if (isJustRegistered) {
      return res.json({ operation: RESULT_TYPE.REGISTER });
    }

    var newName, newLastname;
    if (req.body.name !== user.name) {
      newName = req.body.name;
    }
    if (req.body.lastname !== user.lastname) {
      newLastname = req.body.lastname;
    }

    if (!newName && !newLastname) {
      return res.json({ operation: RESULT_TYPE.LOGIN });
    }

    if (newName) {
      user.name = newName;
    }

    if (newLastname) {
      user.lastname = newLastname;
    }

    user.save(function(err) {
      return err ? next(err) : res.json({ operation: RESULT_TYPE.LOGIN });
    });
  });
}

module.exports = auth;