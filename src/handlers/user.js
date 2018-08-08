const UserPresenter = require('./presenters/userPresenter');

/**
 * Обработчик запроса на получение профиля пользователя.
 */
const User = require('../models/user').default;

/**
 * В параметрах запроса берём id пользователя
 * или возвращаем профиль текущего авторизованного пользователя.
 */
function getById(req, res, next) {
  const userId = req.params.user_id || req.user._id;

  User.findById(
    userId,
    'name lastname regDate',
    function(err, user) {
      return err ?
        next(err) :
        res.json(UserPresenter.getData(user));
    },
  );
}

module.exports = {
  getById: getById,
};
