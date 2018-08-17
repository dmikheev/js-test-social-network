import { IEntitiesState } from './entites/IEntitiesState';
import { IAuthState } from './IAuthState';
import { IFriendsPageState } from './IFriendsPageState';
import { ISearchPageState } from './ISearchPageState';

export interface IAppState {
  auth: IAuthState;
  entities: IEntitiesState;
  friendsPage: IFriendsPageState;
  searchPage: ISearchPageState;
}
