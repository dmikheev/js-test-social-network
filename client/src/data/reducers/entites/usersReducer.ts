import { IUser } from '../../../api/dataTypes';
import { AuthActionType } from '../../actions/authActions';
import { FriendshipActionType } from '../../actions/friendshipActions';
import { TAppAction } from '../../actions/TAppAction';
import { UserActionType } from '../../actions/userActions';
import { addOrReplaceEntities } from './entitiesUtils';
import { IUsersState, IUserState } from './IUsersState';

export default function usersReducer(state: IUsersState = {}, action: TAppAction): IUsersState {
  switch (action.type) {
    case AuthActionType.CHECK_AUTH_RESPONSE_SUCCESS:
      return addOrReplaceEntities(state, ['data', 'id'], [userToUserState(action.data)]);

    case AuthActionType.AUTH_RESPONSE_SUCCESS:
      return addOrReplaceEntities(state, ['data', 'id'], [userToUserState(action.data.user)]);

    case UserActionType.GET_USER_REQUEST: {
      const userData = state[action.requestActionData.id];

      return {
        ...state,
        [action.requestActionData.id]: {
          ...userData,
          isFetching: true,
        },
      };
    }

    case UserActionType.GET_USER_RESPONSE_SUCCESS:
      return addOrReplaceEntities(state, ['data', 'id'], [userToUserState(action.data)]);

    case UserActionType.GET_USER_RESPONSE_ERROR: {
      const userData = state[action.requestActionData.id];

      return {
        ...state,
        [action.requestActionData.id]: {
          ...userData,
          isFetching: false,
        },
      };
    }

    case FriendshipActionType.GET_FRIENDSHIPS_RESPONSE_SUCCESS:
      return addOrReplaceEntities(state, ['data', 'id'], action.data.users.map(userToUserState));

    case UserActionType.FIND_USERS_RESPONSE_SUCCESS:
      return addOrReplaceEntities(state, ['data', 'id'], action.data.foundUsers.map(userToUserState));
  }

  return state;
}

type UserToUsersStateFunc = (user: IUser) => IUserState;
const userToUserState: UserToUsersStateFunc = (user) => ({
  data: user,
  isFetching: false,
});
