export interface IFriendsPageState extends Readonly<IFriendsPageStateMutable> {}
interface IFriendsPageStateMutable {
  didInvalidate: boolean;
  isFetching: boolean;
}
