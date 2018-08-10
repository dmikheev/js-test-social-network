import ApplicationError from './applicationError';

const defaultMessage = 'User cannot decline provided friendship';

export default class WrongUserDeclineFriendshipError extends ApplicationError {
  constructor(message: string = defaultMessage, status: number = 403) {
    super(message, status);
  }
}
