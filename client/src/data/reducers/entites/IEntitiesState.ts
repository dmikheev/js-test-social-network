import { IFriendshipsState } from './IFriendshipsState';
import { IUsersState } from './IUsersState';

export interface IEntitiesState extends Readonly<IEntitiesStateMutable> {}
interface IEntitiesStateMutable {
  friendships: IFriendshipsState;
  users: IUsersState;
}
