import { ThunkAction } from 'redux-thunk';
import api from '../../api/api';
import { IFriendship } from '../../api/dataTypes';
import { IFriendshipDeclineResponse } from '../../api/friendship';
import { IFriendshipsGetAllResponse } from '../../api/friendships';
import { getFriendshipKeyBySenderAndReceiverIds } from '../reducers/entites/friendshipsHelpers';
import { IAppState } from '../reducers/IAppState';
import { reduxRequest } from './reduxRequest';

export enum FriendshipActionType {
  GET_FRIENDSHIPS_REQUEST = 'GET_FRIENDSHIPS_REQUEST',
  GET_FRIENDSHIPS_RESPONSE_SUCCESS = 'GET_FRIENDSHIPS_RESPONSE_SUCCESS',
  GET_FRIENDSHIPS_RESPONSE_ERROR = 'GET_FRIENDSHIPS_RESPONSE_ERROR',
  REQUEST_FRIENDSHIP_REQUEST = 'REQUEST_FRIENDSHIP_REQUEST',
  REQUEST_FRIENDSHIP_RESPONSE_SUCCESS = 'REQUEST_FRIENDSHIP_RESPONSE_SUCCESS',
  REQUEST_FRIENDSHIP_RESPONSE_ERROR = 'REQUEST_FRIENDSHIP_RESPONSE_ERROR',
  ACCEPT_FRIENDSHIP_REQUEST = 'ACCEPT_FRIENDSHIP_REQUEST',
  ACCEPT_FRIENDSHIP_RESPONSE_SUCCESS = 'ACCEPT_FRIENDSHIP_RESPONSE_SUCCESS',
  ACCEPT_FRIENDSHIP_RESPONSE_ERROR = 'ACCEPT_FRIENDSHIP_RESPONSE_ERROR',
  DECLINE_FRIENDSHIP_REQUEST = 'DECLINE_FRIENDSHIP_REQUEST',
  DECLINE_FRIENDSHIP_RESPONSE_SUCCESS = 'DECLINE_FRIENDSHIP_RESPONSE_SUCCESS',
  DECLINE_FRIENDSHIP_RESPONSE_ERROR = 'DECLINE_FRIENDSHIP_RESPONSE_ERROR',
}

interface IGetFriendshipsRequestAction {
  type: FriendshipActionType.GET_FRIENDSHIPS_REQUEST;
}
interface IGetFriendshipsResponseSuccessAction {
  data: IFriendshipsGetAllResponse;
  type: FriendshipActionType.GET_FRIENDSHIPS_RESPONSE_SUCCESS;
}
interface IGetFriendshipsResponseErrorAction {
  type: FriendshipActionType.GET_FRIENDSHIPS_RESPONSE_ERROR;
}

type TGetFriendshipsActions =
  IGetFriendshipsRequestAction | IGetFriendshipsResponseSuccessAction | IGetFriendshipsResponseErrorAction;
type TGetFriendshipsThunkAction = ThunkAction<Promise<any>, IAppState, void, TGetFriendshipsActions>;
type TGetFriendshipsActionCreator = () => TGetFriendshipsThunkAction;
export const getFriendships: TGetFriendshipsActionCreator = () => (dispatch, getState) => {
  const state = getState();
  if (!state.friendsPage.didInvalidate || state.friendsPage.isFetching) {
    return Promise.resolve();
  }

  return dispatch(reduxRequest(api.friendships.getAll(), {
    types: {
      error: FriendshipActionType.GET_FRIENDSHIPS_RESPONSE_ERROR,
      request: FriendshipActionType.GET_FRIENDSHIPS_REQUEST,
      success: FriendshipActionType.GET_FRIENDSHIPS_RESPONSE_SUCCESS,
    },
  }));
};

interface IRequestFriendshipRequestAction {
  requestActionData: {
    key: string;
  };
  type: FriendshipActionType.REQUEST_FRIENDSHIP_REQUEST;
}
interface IRequestFriendshipResponseSuccessAction {
  data: IFriendship;
  type: FriendshipActionType.REQUEST_FRIENDSHIP_RESPONSE_SUCCESS;
}
interface IRequestFriendshipResponseErrorAction {
  requestActionData: {
    key: string;
  };
  type: FriendshipActionType.REQUEST_FRIENDSHIP_RESPONSE_ERROR;
}

type TRequestFriendshipActions =
  IRequestFriendshipRequestAction | IRequestFriendshipResponseSuccessAction | IRequestFriendshipResponseErrorAction;
type TRequestFriendshipThunkAction = ThunkAction<Promise<any>, IAppState, void, TRequestFriendshipActions>;
type TRequestFriendshipActionCreator = (receiverId: string) => TRequestFriendshipThunkAction;
export const requestFriendship: TRequestFriendshipActionCreator = (receiverId) => (dispatch, getState) => {
  const state = getState();
  const senderId = state.auth.userId;
  if (!senderId) {
    return Promise.resolve();
  }

  const key = getFriendshipKeyBySenderAndReceiverIds(senderId, receiverId);
  const friendshipData = state.entities.friendships[key];
  if (friendshipData && friendshipData.isFetching) {
    return Promise.resolve();
  }

  return dispatch(reduxRequest(api.friendship.request(receiverId), {
    requestActionData: { key },
    types: {
      error: FriendshipActionType.REQUEST_FRIENDSHIP_RESPONSE_ERROR,
      request: FriendshipActionType.REQUEST_FRIENDSHIP_REQUEST,
      success: FriendshipActionType.REQUEST_FRIENDSHIP_RESPONSE_SUCCESS,
    },
  }));
};

interface IAcceptFriendshipRequestAction {
  requestActionData: {
    key: string;
  };
  type: FriendshipActionType.ACCEPT_FRIENDSHIP_REQUEST;
}
interface IAcceptFriendshipResponseSuccessAction {
  data: IFriendship;
  type: FriendshipActionType.ACCEPT_FRIENDSHIP_RESPONSE_SUCCESS;
}
interface IAcceptFriendshipResponseErrorAction {
  requestActionData: {
    key: string;
  };
  type: FriendshipActionType.ACCEPT_FRIENDSHIP_RESPONSE_ERROR;
}

type TAcceptFriendshipActions =
  IAcceptFriendshipRequestAction | IAcceptFriendshipResponseSuccessAction | IAcceptFriendshipResponseErrorAction;
type TAcceptFriendshipThunkAction = ThunkAction<Promise<any>, IAppState, void, TAcceptFriendshipActions>;
type TAcceptFriendshipActionCreator = (friendshipKey: string) => TAcceptFriendshipThunkAction;
export const acceptFriendship: TAcceptFriendshipActionCreator = (friendshipKey) => (dispatch, getState) => {
  const state = getState();
  const friendshipState = state.entities.friendships[friendshipKey];
  if (!friendshipState || friendshipState.isFetching) {
    return Promise.resolve();
  }

  return dispatch(reduxRequest(api.friendship.accept(friendshipState.data!.id), {
    requestActionData: { key: friendshipKey },
    types: {
      error: FriendshipActionType.ACCEPT_FRIENDSHIP_RESPONSE_ERROR,
      request: FriendshipActionType.ACCEPT_FRIENDSHIP_REQUEST,
      success: FriendshipActionType.ACCEPT_FRIENDSHIP_RESPONSE_SUCCESS,
    },
  }));
};

interface IDeclineFriendshipRequestAction {
  requestActionData: {
    key: string;
  };
  type: FriendshipActionType.DECLINE_FRIENDSHIP_REQUEST;
}
interface IDeclineFriendshipResponseSuccessAction {
  data: IFriendshipDeclineResponse;
  requestActionData: {
    key: string;
  };
  type: FriendshipActionType.DECLINE_FRIENDSHIP_RESPONSE_SUCCESS;
}
interface IDeclineFriendshipResponseErrorAction {
  requestActionData: {
    key: string;
  };
  type: FriendshipActionType.DECLINE_FRIENDSHIP_RESPONSE_ERROR;
}

type TDeclineFriendshipActions =
  IDeclineFriendshipRequestAction | IDeclineFriendshipResponseSuccessAction | IDeclineFriendshipResponseErrorAction;
type TDeclineFriendshipThunkAction = ThunkAction<Promise<any>, IAppState, void, TDeclineFriendshipActions>;
type TDeclineFriendshipActionCreator = (friendshipKey: string) => TDeclineFriendshipThunkAction;
export const declineFriendship: TDeclineFriendshipActionCreator = (friendshipKey) => (dispatch, getState) => {
  const state = getState();
  const friendshipState = state.entities.friendships[friendshipKey];
  if (!friendshipState || friendshipState.isFetching) {
    return Promise.resolve();
  }

  return dispatch(reduxRequest(api.friendship.decline(friendshipState.data!.id), {
    requestActionData: { key: friendshipKey },
    types: {
      error: FriendshipActionType.DECLINE_FRIENDSHIP_RESPONSE_ERROR,
      request: FriendshipActionType.DECLINE_FRIENDSHIP_REQUEST,
      success: FriendshipActionType.DECLINE_FRIENDSHIP_RESPONSE_SUCCESS,
    },
  }));
};

export type TFriendshipAction =
  TGetFriendshipsActions
  | TRequestFriendshipActions
  | TAcceptFriendshipActions
  | TDeclineFriendshipActions;
