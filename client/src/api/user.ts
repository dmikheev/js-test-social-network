import { IUser } from './dataTypes';
import request from './request';

const user = {
  get(userId?: string): Promise<IUser> {
    return request(`/api/user/get/${userId ? userId : ''}`);
  },
};
export default user;
