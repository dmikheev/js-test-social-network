export interface IUser {
  id: string;
  lastname: string;
  name: string;
  regDate: number;
}

export interface IFriendship {
  id: string;
  isAccepted: boolean;
  receiverId: string;
  senderId: string;
}

export interface IApiError {
  error: {
    message: string;
    status?: number;
  };
}
