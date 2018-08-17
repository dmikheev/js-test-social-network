import { ThunkAction } from 'redux-thunk';
import api from '../../api/api';
import { IUserAuthResponse } from '../../api/auth';
import { IApiError, IUser } from '../../api/dataTypes';
import { IAppState } from '../reducers/IAppState';
import { reduxRequest } from './reduxRequest';

export enum AuthActionType {
  CHECK_AUTH_REQUEST = 'CHECK_AUTH_REQUEST',
  CHECK_AUTH_RESPONSE_SUCCESS = 'CHECK_AUTH_RESPONSE_SUCCESS',
  CHECK_AUTH_RESPONSE_ERROR = 'CHECK_AUTH_RESPONSE_ERROR',
  AUTH_REQUEST = 'AUTH_REQUEST',
  AUTH_RESPONSE_SUCCESS = 'AUTH_RESPONSE_SUCCESS',
  AUTH_RESPONSE_ERROR = 'AUTH_RESPONSE_ERROR',
}

interface ICheckAuthRequestAction {
  type: AuthActionType.CHECK_AUTH_REQUEST;
}
interface ICheckAuthResponseSuccessAction {
  data: IUser;
  type: AuthActionType.CHECK_AUTH_RESPONSE_SUCCESS;
}
interface ICheckAuthResponseErrorAction {
  data: IApiError;
  type: AuthActionType.CHECK_AUTH_RESPONSE_ERROR;
}

type TCheckAuthActions = ICheckAuthRequestAction | ICheckAuthResponseSuccessAction | ICheckAuthResponseErrorAction;
type TCheckAuthThunkAction = ThunkAction<Promise<any>, IAppState, void, TCheckAuthActions>;
export function checkAuthIfNeeded(): TCheckAuthThunkAction {
  return (dispatch, getState) => {
    if (!shouldCheckAuth(getState())) {
      return Promise.resolve();
    }

    return dispatch(checkAuth());
  };
}

function shouldCheckAuth(state: IAppState) {
  return !state.auth.isFetching && state.auth.didInvalidate;
}
function checkAuth(): ThunkAction<Promise<IUser>, IAppState, void, TCheckAuthActions> {
  return (dispatch) => {
    return dispatch(reduxRequest(api.user.get(), {
      types: {
        error: AuthActionType.CHECK_AUTH_RESPONSE_ERROR,
        request: AuthActionType.CHECK_AUTH_REQUEST,
        success: AuthActionType.CHECK_AUTH_RESPONSE_SUCCESS,
      },
    }))
      .catch(() => {});
  };
}

interface IAuthRequestAction {
  type: AuthActionType.AUTH_REQUEST;
}
interface IAuthResponseSuccessAction {
  data: IUserAuthResponse;
  type: AuthActionType.AUTH_RESPONSE_SUCCESS;
}
interface IAuthResponseErrorAction {
  data: IApiError;
  type: AuthActionType.AUTH_RESPONSE_ERROR;
}

type TAuthActions = IAuthRequestAction | IAuthResponseSuccessAction | IAuthResponseErrorAction;
type TAuthThunkAction = ThunkAction<Promise<any>, IAppState, void, TCheckAuthActions>;
export function auth(login: string, pass: string, name: string, lastName: string): TAuthThunkAction {
  return (dispatch, getState) => {
    if (getState().auth.isFetching) {
      return Promise.resolve();
    }

    const authPromise = api.auth({
      login,
      name,
      pass,
      lastname: lastName,
    });
    return dispatch(reduxRequest(authPromise, {
      types: {
        error: AuthActionType.AUTH_RESPONSE_ERROR,
        request: AuthActionType.AUTH_REQUEST,
        success: AuthActionType.AUTH_RESPONSE_SUCCESS,
      },
    }));
  };
}

export type TAuthAction =
  TCheckAuthActions
  | TAuthActions;
