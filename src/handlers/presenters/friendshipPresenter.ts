import { IFriendshipDocument } from '../../models/friendship';

interface IFriendshipClientData {
  id: string;
  isAccepted: boolean;
  receiverId: string;
  senderId: string;
}

const FriendshipPresenter = {
  getData(friendship: IFriendshipDocument): IFriendshipClientData {
    return {
      id: friendship._id,
      isAccepted: friendship.accepted,
      receiverId: friendship.receiverId.toString(),
      senderId: friendship.senderId.toString(),
    };
  },
};
export default FriendshipPresenter;
