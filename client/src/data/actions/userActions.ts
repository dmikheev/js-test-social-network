import { ThunkAction } from 'redux-thunk';
import api from '../../api/api';
import { IUser } from '../../api/dataTypes';
import { IUsersFindResponse } from '../../api/users';
import { IAppState } from '../reducers/IAppState';
import { reduxRequest } from './reduxRequest';

export enum UserActionType {
  GET_USER_REQUEST = 'GET_USER_REQUEST',
  GET_USER_RESPONSE_SUCCESS = 'GET_USER_RESPONSE_SUCCESS',
  GET_USER_RESPONSE_ERROR = 'GET_USER_RESPONSE_ERROR',
  FIND_USERS_REQUEST = 'FIND_USERS_REQUEST',
  FIND_USERS_RESPONSE_SUCCESS = 'FIND_USERS_RESPONSE_SUCCESS',
  FIND_USERS_RESPONSE_ERROR = 'FIND_USERS_RESPONSE_ERROR',
  INVALIDATE_SEARCH_RESULTS = 'INVALIDATE_SEARCH_RESULTS',
}

interface IGetUserRequestAction {
  requestActionData: {
    id: string;
  };
  type: UserActionType.GET_USER_REQUEST;
}
interface IGetUserResponseSuccessAction {
  data: IUser;
  type: UserActionType.GET_USER_RESPONSE_SUCCESS;
}
interface IGetUserResponseErrorAction {
  requestActionData: {
    id: string;
  };
  type: UserActionType.GET_USER_RESPONSE_ERROR;
}

type TGetUserActions = IGetUserRequestAction | IGetUserResponseSuccessAction | IGetUserResponseErrorAction;
type TGetUserThunkAction = ThunkAction<Promise<any>, IAppState, void, TGetUserActions>;
type TGetUserActionCreator = (id?: string) => TGetUserThunkAction;
export const getUser: TGetUserActionCreator = (idParam?: string) => (dispatch, getState) => {
  const state = getState();
  const id = idParam ? idParam : state.auth.userId;
  if (!id) {
    return Promise.resolve();
  }

  const userData = state.entities.users[id];
  if (userData && userData.isFetching) {
    return Promise.resolve();
  }

  return dispatch(reduxRequest(api.user.get(idParam), {
    requestActionData: { id },
    types: {
      error: UserActionType.GET_USER_RESPONSE_ERROR,
      request: UserActionType.GET_USER_REQUEST,
      success: UserActionType.GET_USER_RESPONSE_SUCCESS,
    },
  }));
};

interface IFindUsersRequestActionData {
  pageNum: number;
  searchQuery: string;
}
interface IFindUsersRequestAction {
  requestActionData: IFindUsersRequestActionData;
  type: UserActionType.FIND_USERS_REQUEST;
}
interface IFindUsersResponseSuccessAction {
  data: IUsersFindResponse;
  requestActionData: IFindUsersRequestActionData;
  type: UserActionType.FIND_USERS_RESPONSE_SUCCESS;
}
interface IFindUsersResponseErrorAction {
  requestActionData: IFindUsersRequestActionData;
  type: UserActionType.FIND_USERS_RESPONSE_ERROR;
}

type TFindUsersActions = IFindUsersRequestAction | IFindUsersResponseSuccessAction | IFindUsersResponseErrorAction;
type TFindUsersThunkAction = ThunkAction<Promise<any>, IAppState, void, TFindUsersActions>;
type TFindUsersActionCreator = (searchQuery?: string, pageNum?: number) => TFindUsersThunkAction;
export const findUsers: TFindUsersActionCreator = (searchQuery?, pageNum?) => (dispatch, getState) => {
  const state = getState();
  if (state.searchPage.isFetching) {
    return Promise.resolve();
  }

  return dispatch(reduxRequest(api.users.find(searchQuery, pageNum), {
    requestActionData: {
      pageNum: pageNum || 0,
      searchQuery: searchQuery || '',
    },
    types: {
      error: UserActionType.FIND_USERS_RESPONSE_ERROR,
      request: UserActionType.FIND_USERS_REQUEST,
      success: UserActionType.FIND_USERS_RESPONSE_SUCCESS,
    },
  }));
};

interface IInvalidateSearchResultsAction {
  type: UserActionType.INVALIDATE_SEARCH_RESULTS;
}
export const invalidateSearchResults = () => ({ type: UserActionType.INVALIDATE_SEARCH_RESULTS });

export type TUserAction =
  TGetUserActions
  | TFindUsersActions
  | IInvalidateSearchResultsAction;
