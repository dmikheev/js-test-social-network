var passport = require('passport');

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
  });
}

function registerUser(req, res, next) {

}

function loginUser(req, res, user, next) {

}

module.exports = auth;