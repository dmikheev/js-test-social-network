import ApplicationError from './applicationError';

const defaultMessage = 'User cannot accept provided friendship';

export default class WrongUserAcceptFriendshipError extends ApplicationError {
  constructor(message: string = defaultMessage, status: number = 403) {
    super(message, status);
  }
}
