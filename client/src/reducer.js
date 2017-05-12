import {fromJS} from 'immutable';
import * as ACTIONS from './actions';
import { SEARCH_USER_FRIENDSHIP_STATUSES } from './components/pages/SearchPage/searchUserFriendshipStatuses';

export default function(state, action) {
  if (!state) {
    state = getDefaultState();
  }

  switch (action.type) {
    case ACTIONS.REQUEST_AUTHORIZATION_CHECK: {
      return state.setIn(['authorization', 'isFetching'], true);
    }

    case ACTIONS.HANDLE_AUTHORIZATION_CHECK_RESPONSE: {
      return state.mergeIn(['authorization'], {
        isFetching: false,
        didInvalidate: false,
        isUserAuthorized: action.data.isUserAuthorized,
        userId: action.data.user && action.data.user.id,
      });
    }

    case ACTIONS.HANDLE_AUTHORIZATION_RESPONSE: {
      if (!action.data) {
        return state;
      }

      return state.mergeIn(['authorization'], {
        isFetching: false,
        didInvalidate: false,
        isUserAuthorized: true,
        userId: action.data.user.id,
      });
    }

    case ACTIONS.REQUEST_PROFILE_PAGE_DATA: {
      return state.setIn(['profilePage', 'isFetching'], true);
    }

    case ACTIONS.REQUEST_PROFILE_PAGE_DATA_RESPONSE: {
      return state.mergeIn(['profilePage'], {
        isFetching: false,
        didInvalidate: false,
        firstName: action.data.user.name,
        lastName: action.data.user.lastname,
        regDate: action.data.user.regDate,
      });
    }

    case ACTIONS.REQUEST_FRIENDS_PAGE_DATA: {
      return state.setIn(['friendsPage', 'isFetching'], true);
    }

    case ACTIONS.REQUEST_FRIENDS_PAGE_DATA_RESPONSE: {
      return state.mergeIn(['friendsPage'], {
        isFetching: false,
        didInvalidate: false,
        inbox: action.data.friendships.incoming,
        outbox: action.data.friendships.outcoming,
        friends: action.data.friendships.friends,
      });
    }

    case ACTIONS.REQUEST_FRIENDSHIP_RESPONSE: {
      let newState = state;
      newState = newState
        .updateIn(['friendsPage', 'outbox'], outbox => outbox.push(fromJS(action.data)));

      const searchPageUsers = newState.getIn(['searchPage', 'users']);
      const changingUserIdx =
        searchPageUsers.findIndex((user) => user.get('id') === action.data.receiver.id);

      return newState.setIn(
        ['searchPage', 'users', changingUserIdx, 'status'],
        SEARCH_USER_FRIENDSHIP_STATUSES.REQUESTED
      );
    }

    case ACTIONS.ACCEPT_FRIENDSHIP_RESPONSE: {
      let newState = state;
      newState = newState
        .updateIn(['friendsPage', 'inbox'], inbox =>
          inbox.filter(friendship => friendship.get('id') !== action.data.id))
        .updateIn(['friendsPage', 'friends'], friends => friends.push(fromJS(action.data)));

      const searchPageUsers = newState.getIn(['searchPage', 'users']);
      const changingUserIdx =
        searchPageUsers.findIndex((user) => user.get('id') === action.data.sender.id);
      if (changingUserIdx !== -1) {
        newState = newState
          .setIn(
            ['searchPage', 'users', changingUserIdx, 'status'],
            SEARCH_USER_FRIENDSHIP_STATUSES.FRIEND
          );
      }

      return newState;
    }

    case ACTIONS.REMOVE_FRIENDSHIP_REQUEST_RESPONSE: {
      let newState = state;
      newState = newState
        .updateIn(['friendsPage', 'outbox'], outbox =>
          outbox.filter(friendship => friendship.get('id') !== action.data.id));

      const searchPageUsers = newState.getIn(['searchPage', 'users']);
      const changingUserIdx =
        searchPageUsers.findIndex((user) => user.get('friendshipId') === action.data.id);
      if (changingUserIdx !== -1) {
        newState = newState
          .setIn(
            ['searchPage', 'users', changingUserIdx, 'status'],
            SEARCH_USER_FRIENDSHIP_STATUSES.NONE
          )
          .deleteIn(['searchPage', 'users', changingUserIdx, 'friendshipId']);
      }

      return newState;
    }

    case ACTIONS.REMOVE_FRIENDSHIP_RESPONSE: {
      let newState = state;
      newState = newState
        .updateIn(['friendsPage', 'friends'], friends =>
          friends.filter(friendship => friendship.get('id') !== action.data.id))
        .updateIn(['friendsPage', 'inbox'], inbox => inbox.push(fromJS(action.data)));

      const searchPageUsers = newState.getIn(['searchPage', 'users']);
      const changingUserIdx =
        searchPageUsers.findIndex((user) => user.get('friendshipId') === action.data.id);
      if (changingUserIdx !== -1) {
        newState = newState
          .setIn(
            ['searchPage', 'users', changingUserIdx, 'status'],
            SEARCH_USER_FRIENDSHIP_STATUSES.RECEIVED
          )
          .setIn(['searchPage', 'users', changingUserIdx, 'friendshipId'], action.data.id);
      }

      return newState;
    }

    case ACTIONS.UPDATE_SEARCH_USERS: {
      return state.setIn(['searchPage', 'users'], fromJS(action.data));
    }

    default: return state;
  }
}

function getDefaultState() {
  return fromJS({
    authorization: {
      isFetching: false,
      didInvalidate: true,
      isUserAuthorized: null,
      userId: null,
    },
    profilePage: {
      isFetching: false,
      didInvalidate: true,
      firstName: '',
      lastName: '',
      regDate: '',
    },
    // TODO: refactor (normalize)
    friendsPage: {
      isFetching: false,
      didInvalidate: true,
      inbox: [],
      outbox: [],
      friends: [],
    },
    searchPage: {
      users: [

      ],
    },
  });
}
