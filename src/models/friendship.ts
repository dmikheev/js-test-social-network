import mongoose, { Document, Model } from 'mongoose';
import WrongUserAcceptFriendshipError from '../errors/wrongUserAcceptFriendshipError';
import WrongUserDeclineFriendshipError from '../errors/wrongUserDeclineFriendshipError';
import UserPresenter from '../handlers/presenters/userPresenter';

/**
 * Модель дружбы для mongoose
 */

const ObjectId = mongoose.Schema.Types.ObjectId;
type TObjectId = mongoose.Types.ObjectId;

export interface IFriendshipDocument extends Document {
  accepted: boolean;
  receiverId: TObjectId;
  senderId: TObjectId;

  accept(acceptedUserId: string, callback?: (err: Error | null, friendship?: IFriendshipDocument) => void):
    Promise<IFriendshipDocument>;
  decline(declinedUserId: string, callback?: (err: Error | null, friendship?: IFriendshipDocument) => void):
    Promise<IFriendshipDocument>;
}

type TFindFriendshipsForUserFunc = (userId: TObjectId) => Promise<IFriendshipDocument[]>;
interface IFriendshipModel extends Model<IFriendshipDocument> {
  findFriendshipsForUser: TFindFriendshipsForUserFunc;
  getItemsForUser(userId: TObjectId, populate: boolean, callback?: (err: Error | null, result?: any) => void):
    Promise<any>;
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

friendshipSchema.methods.accept = function(
  acceptedUserId: string,
  cb?: (err: Error | null, friendship?: IFriendshipDocument) => void,
): Promise<IFriendshipDocument> {
  return new Promise((resolve, reject) => {
    if (!this.receiverId.equals(acceptedUserId)) {
      const error = new WrongUserAcceptFriendshipError();
      if (cb) {
        cb(error);
      }

      reject(error);

      return;
    }

    if (this.accepted) {
      if (cb) {
        cb(null, this);
      }

      resolve(this);
      return;
    }

    this.accepted = true;
    const savePromise = this.save()
      .then(() => {
        if (cb) {
          cb(null, this);
        }

        return this;
      })
      .catch((err: Error) => {
        if (cb) {
          cb(err);
        }

        throw err;
      });

    resolve(savePromise);
  });
};

friendshipSchema.methods.decline = function(
  declinedUserId: string,
  cb?: (err: Error | null, friendship?: IFriendshipDocument) => void,
): Promise<IFriendshipDocument> {
  return new Promise<IFriendshipDocument>((resolve, reject) => {
    if (!this.accepted) {
      if (!this.senderId.equals(declinedUserId)) {
        const error = new WrongUserDeclineFriendshipError();
        if (cb) {
          cb(error);
        }

        reject(error);
        return;
      }

      const removePromise = this.remove()
        .then(() => {
          if (cb) {
            cb(null);
          }
        })
        .catch((removeErr: Error) => {
          if (cb) {
            cb(removeErr);
          }

          throw removeErr;
        });

      resolve(removePromise);
      return;
    }

    if (!this.senderId.equals(declinedUserId) && !this.receiverId.equals(declinedUserId)) {
      const error = new WrongUserDeclineFriendshipError();
      if (cb) {
        cb(error);
      }

      reject(error);
      return;
    }

    if (this.receiverId.equals(declinedUserId)) {
      this.accepted = false;
      const receiverSavePromise = this.save()
        .then(() => {
          if (cb) {
            cb(null, this);
          }

          return this;
        })
        .catch((saveErr: Error) => {
          if (cb) {
            cb(saveErr);
          }

          throw saveErr;
        });

      resolve(receiverSavePromise);
      return;
    }

    this.senderId = this.receiverId;
    this.receiverId = declinedUserId;
    this.accepted = false;

    const savePromise = this.save()
      .then(() => {
        if (cb) {
          cb(null, this);
        }

        return this;
      })
      .catch((saveErr: Error) => {
        if (cb) {
          cb(saveErr);
        }

        throw saveErr;
      });

    resolve(savePromise);
  });
};

const findFriendshipsForUser: TFindFriendshipsForUserFunc = async function(this: IFriendshipModel, userId) {
  const [sentFriendships, receivedFriendships] = await Promise.all([
    this.find({ senderId: userId }).exec(),
    this.find({ receiverId: userId }).exec(),
  ]);

  return sentFriendships.concat(receivedFriendships);
};
friendshipSchema.statics.findFriendshipsForUser = findFriendshipsForUser;

/**
 * Получаем объект с заявками и друзьями пользователя
 * @param {ObjectId} userId - id пользователя, для которого получаем информацию
 * @param {Boolean} populate - требуется ли возвращать имя/фамилию друга
 * @param callback
 * Возвращаем объект с полями:
 *  - {Array} incoming - полученные заявки на дружбу
 *  - {Array} outcoming - отправленные заявки на дружбу
 *  - {Array} friends - подтверждённые заявки на дружбу
 */
friendshipSchema.statics.getItemsForUser = function(
  userId: TObjectId,
  populate: boolean,
  callback?: (err: Error | null, result?: any) => void,
): Promise<any> {
  return new Promise<any>((resolve) => {
    const senderQuery = this.find({ senderId: userId });

    if (populate) {
      senderQuery.populate('senderId');
      senderQuery.populate('receiverId');
    }

    let senderResultsClosured: any;

    const senderQueryPromise = senderQuery.exec()
      .then((senderResults: any) => {
        senderResultsClosured = senderResults;

        const receiverQuery = this.find({ receiverId: userId });

        if (populate) {
          receiverQuery.populate('senderId');
          receiverQuery.populate('receiverId');
        }

        return receiverQuery.exec();
      })
      .then((receiverResults: any) => {
        const results = constructResultForUser(senderResultsClosured, receiverResults);

        if (callback) {
          callback(null, results);
        }

        return results;
      })
      .catch((err: Error) => {
        if (callback) {
          callback(err);
        }

        throw err;
      });

    resolve(senderQueryPromise);
  });
};

const Friendship = mongoose.model<IFriendshipDocument, IFriendshipModel>('Friendship', friendshipSchema);
export default Friendship;

/**
 * Собираем итоговый объект для функции getItemsForUser
 * @param {Array} senderResults - заявки, в которых пользователь является отправителем
 * @param {Array} receiverResults - заявки, в которых пользователь является получателем
 */
function constructResultForUser(senderResults: any, receiverResults: any) {
  const incoming: any[] = [];
  const outcoming: any[] = [];
  const friends: any[] = [];
  const result = { incoming, outcoming, friends };

  for (const senderResult of senderResults) {
    if (senderResult.accepted) {
      result.friends.push(constructFriendshipResult(senderResult));
    } else {
      result.outcoming.push(constructFriendshipResult(senderResult));
    }
  }

  for (const receiverResult of receiverResults) {
    if (receiverResult.accepted) {
      result.friends.push(constructFriendshipResult(receiverResult));
    } else {
      result.incoming.push(constructFriendshipResult(receiverResult));
    }
  }

  return result;
}

function constructFriendshipResult(friendshipData: any) {
  return {
    accepted: friendshipData.accepted,
    id: friendshipData._id,
    receiver: UserPresenter.getData(friendshipData.receiverId),
    sender: UserPresenter.getData(friendshipData.senderId),
  };
}
