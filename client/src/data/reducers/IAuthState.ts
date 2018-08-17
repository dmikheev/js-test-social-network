export interface IAuthState extends Readonly<IAuthStateMutable> {}
interface IAuthStateMutable {
  didInvalidate: boolean;
  isFetching: boolean;
  userId?: string;
}
