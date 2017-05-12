/**
 * @see SEARCH_USER_FRIENDSHIP_STATUSES
 */
export const SEARCH_USER_FRIENDSHIP_STATUSES = {
  /** Текущий авторизованный пользователь */
  SELF: 0,

  /** Пользователь не в друзьях и без заявок */
  NONE: 1,

  /** От пользователя получена заявка */
  RECEIVED: 2,

  /** Пользователю отправлена заявка */
  REQUESTED: 3,

  /** Пользователь в списке друзей */
  FRIEND: 4
};
