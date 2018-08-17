import { AuthActionType } from '../actions/authActions';
import { TAppAction } from '../actions/TAppAction';
import { IAuthState } from './IAuthState';

const defaultState: IAuthState = {
  didInvalidate: true,
  isFetching: false,
  userId: undefined,
};
export default function authReducer(state = defaultState, action: TAppAction): IAuthState {
  switch (action.type) {
    case AuthActionType.CHECK_AUTH_REQUEST:
      return {
        ...state,
        isFetching: true,
      };

    case AuthActionType.CHECK_AUTH_RESPONSE_SUCCESS:
      return {
        didInvalidate: false,
        isFetching: false,
        userId: action.data.id,
      };

    case AuthActionType.CHECK_AUTH_RESPONSE_ERROR:
      return {
        didInvalidate: false,
        isFetching: false,
        userId: undefined,
      };

    case AuthActionType.AUTH_REQUEST:
      return {
        ...state,
        isFetching: true,
      };

    case AuthActionType.AUTH_RESPONSE_SUCCESS:
      return {
        didInvalidate: false,
        isFetching: false,
        userId: action.data.user.id,
      };
  }

  return state;
}
