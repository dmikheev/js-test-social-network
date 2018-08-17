import { IFriendship, IUser } from './dataTypes';
import request from './request';

export interface IFriendshipsGetAllResponse {
  friendships: IFriendship[];
  users: IUser[];
}

const friendships = {
  getAll(): Promise<IFriendshipsGetAllResponse> {
    return request('/api/friendships/getAll');
  },
};
export default friendships;
