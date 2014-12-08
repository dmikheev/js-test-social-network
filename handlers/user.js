var User = require('./../models/user');

function getById(req, res, next, userId) {
  userId = userId || req.params.user_id;

  var user = User.findById(
    userId,
    'name lastname regDate',
    function(err, user) {
      return err ? next(err) : res.json(user);
    }
  );
}

function getCurrentUser(req, res, next) {
  return getById(req, res, next, req.user._id);
}

module.exports = {
  getById: getById,
  getCurrentUser: getCurrentUser
};