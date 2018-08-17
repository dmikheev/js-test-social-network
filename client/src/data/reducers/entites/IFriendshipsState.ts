import { IFriendship } from '../../../api/dataTypes';

export interface IFriendshipState {
  data?: IFriendship;
  isFetching: boolean;
}

export interface IFriendshipsState extends Readonly<IFriendshipsStateMutable> {}
export interface IFriendshipsStateMutable {
  [key: string]: IFriendshipState;
}
