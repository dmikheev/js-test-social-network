/**
 * Модуль, собирающий все обработчики
 */
const auth = require('./auth');
const user = require('./user');
const users = require('./users');
const friendships = require('./friendships');
const friendship = require('./friendship');

module.exports = {
  auth: auth,
  friendship: friendship,
  friendships: friendships,
  user: user,
  users: users,
};
