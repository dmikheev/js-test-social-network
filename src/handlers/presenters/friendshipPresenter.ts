import { IFriendshipDocument } from '../../models/friendship';
import UserPresenter, { IUserClientData } from './userPresenter';

interface IFriendshipClientData {
  accepted: boolean;
  id: string;
  receiverId: string;
  senderId: string;
}

/** @deprecated */
interface IFriendshipClientDataOld {
  [key: string]: any;

  accepted: boolean;
  id: string;
  receiver: IUserClientData;
  sender: IUserClientData;
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

  /** @deprecated */
  getDataOld(friendship: any): IFriendshipClientDataOld {
    return {
      accepted: friendship.accepted,
      id: friendship._id,
      receiver: UserPresenter.getData(friendship.receiverId),
      sender: UserPresenter.getData(friendship.senderId),
    };
  },
};
export default FriendshipPresenter;
