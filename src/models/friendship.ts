import mongoose, { Document, Model } from 'mongoose';
import WrongUserAcceptFriendshipError from '../errors/wrongUserAcceptFriendshipError';
import WrongUserDeclineFriendshipError from '../errors/wrongUserDeclineFriendshipError';
import User, { IUserDocument } from './user';

/**
 * Модель дружбы для mongoose
 */

const ObjectId = mongoose.Schema.Types.ObjectId;
type TObjectId = mongoose.Types.ObjectId;

export interface IFriendshipDocument extends Document {
  accepted: boolean;
  receiverId: TObjectId;
  senderId: TObjectId;

  accept: TAcceptFunc;
  decline: TDeclineFunc;
}

interface IFriendshipModel extends Model<IFriendshipDocument> {
  findFriendshipsForUser: TFindFriendshipsForUserFunc;
  findFriendshipsWithUsersForUser: TFindFriendshipsWithUsersForUserFunc;
}

/**
 * senderId - id пользователя, отправившего заявку
 * receiverId - id пользователя, которому отправлена заявка
 * accepted - подтверждена заявка или нет
 */
const friendshipSchema = new mongoose.Schema({
  accepted: { type: Boolean, required: true },
  receiverId: { type: ObjectId, required: true, ref: 'User' },
  senderId: { type: ObjectId, required: true, ref: 'User' },
});

friendshipSchema.index({ senderId: 1 });
friendshipSchema.index({ receiverId: 1 });

type TAcceptFunc = (acceptedUserId: string) => Promise<IFriendshipDocument>;
const accept: TAcceptFunc = async function(this: IFriendshipDocument, acceptedUserId) {
  if (!this.receiverId.equals(acceptedUserId)) {
    throw new WrongUserAcceptFriendshipError();
  }

  if (this.accepted) {
    return this;
  }

  this.accepted = true;
  await this.save();

  return this;
};
friendshipSchema.methods.accept = accept;

type TDeclineFunc = (declinedUserId: string) => Promise<IFriendshipDocument | null>;
const decline: TDeclineFunc = async function(this: IFriendshipDocument, declinedUserId) {
  if (!this.accepted) {
    if (!this.senderId.equals(declinedUserId)) {
      throw new WrongUserDeclineFriendshipError();
    }

    await this.remove();
    return null;
  }

  if (!this.senderId.equals(declinedUserId) && !this.receiverId.equals(declinedUserId)) {
    throw new WrongUserDeclineFriendshipError();
  }

  if (this.receiverId.equals(declinedUserId)) {
    this.accepted = false;
    await this.save();

    return this;
  }

  this.senderId = this.receiverId;
  this.receiverId = mongoose.Types.ObjectId(declinedUserId);
  this.accepted = false;

  await this.save();

  return this;
};

friendshipSchema.methods.decline = decline;

type TFindFriendshipsForUserFunc = (userId: TObjectId) => Promise<IFriendshipDocument[]>;
const findFriendshipsForUser: TFindFriendshipsForUserFunc = async function(this: IFriendshipModel, userId) {
  const [sentFriendships, receivedFriendships] = await Promise.all([
    this.find({ senderId: userId }).exec(),
    this.find({ receiverId: userId }).exec(),
  ]);

  return sentFriendships.concat(receivedFriendships);
};
friendshipSchema.statics.findFriendshipsForUser = findFriendshipsForUser;

interface IFindFriendshipsWithUsersResult {
  friendships: IFriendshipDocument[];
  users: IUserDocument[];
}
type TFindFriendshipsWithUsersForUserFunc = (userId: TObjectId) => Promise<IFindFriendshipsWithUsersResult>;
const findFriendshipsWithUsersForUser: TFindFriendshipsWithUsersForUserFunc =
  async function(this: IFriendshipModel, userId) {
    const [sentFriendships, receivedFriendships] = await Promise.all([
      this.find({ senderId: userId }).exec(),
      this.find({ receiverId: userId }).exec(),
    ]);
    const userIds = sentFriendships.map((friendship) => friendship.receiverId).concat(
      receivedFriendships.map((friendship) => friendship.senderId),
    );
    const users = await User.getByIds(userIds);

    return {
      users,
      friendships: sentFriendships.concat(receivedFriendships),
    };
  };
friendshipSchema.statics.findFriendshipsWithUsersForUser = findFriendshipsWithUsersForUser;

const Friendship: IFriendshipModel =
  mongoose.model<IFriendshipDocument, IFriendshipModel>('Friendship', friendshipSchema);
export default Friendship;
