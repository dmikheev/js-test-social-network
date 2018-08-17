import { IUser } from '../../../api/dataTypes';

export const getUserFullName = (user: IUser) => `${user.name} ${user.lastname}`;
