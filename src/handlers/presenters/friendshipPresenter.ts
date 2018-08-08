import UserPresenter, { IUserClientData } from './userPresenter';

interface IFriendshipClientData {
  [key: string]: any;

  accepted: boolean;
  id: string;
  receiver: IUserClientData;
  sender: IUserClientData;
}

const FriendshipPresenter = {
  getData(friendship: any): IFriendshipClientData {
    return {
      accepted: friendship.accepted,
      id: friendship._id,
      receiver: UserPresenter.getData(friendship.receiverId),
      sender: UserPresenter.getData(friendship.senderId),
    };
  },
};
export default FriendshipPresenter;
