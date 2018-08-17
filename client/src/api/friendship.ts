import { IFriendship } from './dataTypes';
import request from './request';

export interface IFriendshipDeclineResponse {
  isDeleted: boolean;
  friendship?: IFriendship;
}

const friendship = {
  request(userId: string): Promise<IFriendship> {
    return request(`/api/friendship/request/${userId}`, {
      method: 'POST',
    });
  },
  accept(friendshipId: string): Promise<IFriendship> {
    return request(`/api/friendship/accept/${friendshipId}`, {
      method: 'POST',
    });
  },
  decline(friendshipId: string): Promise<IFriendshipDeclineResponse> {
    return request(`/api/friendship/decline/${friendshipId}`, {
      method: 'POST',
    });
  },
};
export default friendship;
