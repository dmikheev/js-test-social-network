const UserPresenter = require('./presenters/userPresenter');

/**
 * Обработчик запроса на получение профиля пользователя.
 */
var User = require('./../models/user');

/**
 * В параметрах запроса берём id пользователя
 * или возвращаем профиль текущего авторизованного пользователя.
 */
function getById(req, res, next) {
  var userId = req.params.user_id || req.user._id;

  var user = User.findById(
    userId,
    'name lastname regDate',
    function(err, user) {
      return err ?
        next(err) :
        res.json(UserPresenter.getData(user));
    }
  );
}

module.exports = {
  getById: getById
};
