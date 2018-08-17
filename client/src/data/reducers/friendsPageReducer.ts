import { FriendshipActionType } from '../actions/friendshipActions';
import { TAppAction } from '../actions/TAppAction';
import { IFriendsPageState } from './IFriendsPageState';

const defaultState: IFriendsPageState = {
  didInvalidate: true,
  isFetching: false,
};

export default function friendsPageReducer(state = defaultState, action: TAppAction): IFriendsPageState {
  switch (action.type) {
    case FriendshipActionType.GET_FRIENDSHIPS_REQUEST:
      return {
        ...state,
        isFetching: true,
      };

    case FriendshipActionType.GET_FRIENDSHIPS_RESPONSE_SUCCESS:
      return {
        didInvalidate: false,
        isFetching: false,
      };

    case FriendshipActionType.GET_FRIENDSHIPS_RESPONSE_ERROR:
      return {
        ...state,
        isFetching: false,
      };
  }

  return state;
}
