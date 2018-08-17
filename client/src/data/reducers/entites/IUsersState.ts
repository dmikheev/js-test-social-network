import { IUser } from '../../../api/dataTypes';

export interface IUserState {
  data?: IUser;
  isFetching: boolean;
}

export interface IUsersState extends Readonly<IUsersStateMutable> {}
interface IUsersStateMutable {
  [key: string]: IUserState;
}
