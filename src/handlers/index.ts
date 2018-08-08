/**
 * Модуль, собирающий все обработчики
 */

import auth from './auth';
import * as friendship from './friendship';
import * as friendships from './friendships';
import * as user from './user';
import * as users from './users';

const handlers = {
  auth,
  friendship,
  friendships,
  user,
  users,
};
export default handlers;
