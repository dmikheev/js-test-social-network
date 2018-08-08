import { IUserDocument } from '../../models/user';

export interface IUserClientData {
  [key: string]: any;

  id: string;
  name: string;
  lastname: string;
  regDate: string;
}

const UserPresenter = {
  getData(user: IUserDocument, additionalData: any = {}): IUserClientData {
    const resultData = {} as IUserClientData;

    if (user._id) {
      resultData.id = user._id;
    }
    if (user.name) {
      resultData.name = user.name;
    }
    if (user.lastname) {
      resultData.lastname = user.lastname;
    }
    if (user.regDate) {
      resultData.regDate = new Date(user.regDate).toLocaleDateString();
    }

    return Object.assign(resultData, additionalData);
  },
};
export default UserPresenter;
