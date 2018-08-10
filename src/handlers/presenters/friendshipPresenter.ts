import { IFriendshipDocument } from '../../models/friendship';

interface IFriendshipClientData {
  accepted: boolean;
  id: string;
  receiverId: string;
  senderId: string;
}

const FriendshipPresenter = {
  getData(friendship: IFriendshipDocument): IFriendshipClientData {
    return {
      accepted: friendship.accepted,
      id: friendship._id,
      receiverId: friendship.receiverId.toString(),
      senderId: friendship.senderId.toString(),
    };
  },
};
export default FriendshipPresenter;
