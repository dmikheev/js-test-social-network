import { IFriendship } from '../../../api/dataTypes';
import { FriendshipActionType } from '../../actions/friendshipActions';
import { TAppAction } from '../../actions/TAppAction';
import { UserActionType } from '../../actions/userActions';
import { addOrReplaceEntities } from './entitiesUtils';
import { getFriendshipKey } from './friendshipsHelpers';
import { IFriendshipsState, IFriendshipsStateMutable, IFriendshipState } from './IFriendshipsState';

export default function friendshipsReducer(state: IFriendshipsState = {}, action: TAppAction): IFriendshipsState {
  switch (action.type) {
    case FriendshipActionType.GET_FRIENDSHIPS_RESPONSE_SUCCESS:
      return addOrReplaceEntities(
        state,
        (friendshipState) => getFriendshipKey(friendshipState.data!),
        action.data.friendships.map(friendshipToFriendshipState),
      );

    case FriendshipActionType.REQUEST_FRIENDSHIP_REQUEST:
    case FriendshipActionType.ACCEPT_FRIENDSHIP_REQUEST:
    case FriendshipActionType.DECLINE_FRIENDSHIP_REQUEST: {
      const prevFriendshipState = state[action.requestActionData.key];

      return {
        ...state,
        [action.requestActionData.key]: {
          ...prevFriendshipState,
          isFetching: true,
        },
      };
    }

    case FriendshipActionType.REQUEST_FRIENDSHIP_RESPONSE_SUCCESS:
    case FriendshipActionType.ACCEPT_FRIENDSHIP_RESPONSE_SUCCESS:
      return addOrReplaceEntities(
        state,
        (friendshipState) => getFriendshipKey(friendshipState.data!),
        [friendshipToFriendshipState(action.data)],
      );

    case FriendshipActionType.DECLINE_FRIENDSHIP_RESPONSE_SUCCESS: {
      const nextState: IFriendshipsStateMutable = Object.assign({}, state);
      delete nextState[action.requestActionData.key];

      return action.data.isDeleted ? nextState : addOrReplaceEntities(
        nextState,
        (friendshipState) => getFriendshipKey(friendshipState.data!),
        [friendshipToFriendshipState(action.data.friendship!)],
      );
    }

    case FriendshipActionType.REQUEST_FRIENDSHIP_RESPONSE_ERROR:
    case FriendshipActionType.ACCEPT_FRIENDSHIP_RESPONSE_ERROR:
    case FriendshipActionType.DECLINE_FRIENDSHIP_RESPONSE_ERROR: {
      const prevFriendshipState = state[action.requestActionData.key];

      return {
        ...state,
        [action.requestActionData.key]: {
          ...prevFriendshipState,
          isFetching: false,
        },
      };
    }

    case UserActionType.FIND_USERS_RESPONSE_SUCCESS:
      return addOrReplaceEntities(
        state,
        (friendshipState) => getFriendshipKey(friendshipState.data!),
        action.data.currentUserFriendships.map(friendshipToFriendshipState),
      );
  }

  return state;
}

type FriendshipToFriendshipStateFunc = (friendship: IFriendship) => IFriendshipState;
const friendshipToFriendshipState: FriendshipToFriendshipStateFunc = (friendship) => ({
  data: friendship,
  isFetching: false,
});
