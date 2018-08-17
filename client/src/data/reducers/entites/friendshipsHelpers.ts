import { IFriendship } from '../../../api/dataTypes';

export function getFriendshipKey(friendship: IFriendship): string {
  return getFriendshipKeyBySenderAndReceiverIds(friendship.senderId, friendship.receiverId);
}

export function getFriendshipKeyBySenderAndReceiverIds(senderId: string, receiverId: string): string {
  return `${senderId}_${receiverId}`;
}
