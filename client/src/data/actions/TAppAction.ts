import { TAuthAction } from './authActions';
import { TFriendshipAction } from './friendshipActions';
import { TUserAction } from './userActions';

export type TAppAction =
  TAuthAction
  | TUserAction
  | TFriendshipAction;
