import { IFriendship, IUser } from './dataTypes';
import request from './request';

export interface IUsersFindResponse {
  currentUserFriendships: IFriendship[];
  foundUsers: IUser[];
  itemsPerPage: number;
  totalItemsCount: number;
}

const users = {
  find(searchQuery?: string, pageNum?: number) {
    return request(`/api/users/find/${searchQuery ? searchQuery : ''}/${pageNum ? pageNum : ''}`);
  },
};
export default users;
