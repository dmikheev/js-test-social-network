import {fromJS} from 'immutable';
import {
  REQUEST_AUTHORIZATION_CHECK,
  HANDLE_AUTHORIZATION_CHECK_RESPONSE,
  HANDLE_AUTHORIZATION_RESPONSE, REQUEST_PROFILE_PAGE_DATA, REQUEST_PROFILE_PAGE_DATA_RESPONSE,
  REQUEST_FRIENDS_PAGE_DATA, REQUEST_FRIENDS_PAGE_DATA_RESPONSE
} from './actions';

export default function(state, action) {
  if (!state) {
    state = getDefaultState();
  }

  switch (action.type) {
    case REQUEST_AUTHORIZATION_CHECK: {
      return state.setIn(['authorization', 'isFetching'], true);
    }

    case HANDLE_AUTHORIZATION_CHECK_RESPONSE: {
      return state.mergeIn(['authorization'], {
        isFetching: false,
        didInvalidate: false,
        isUserAuthorized: action.data.isUserAuthorized,
        userId: action.data.user && action.data.user.id,
      });
    }

    case HANDLE_AUTHORIZATION_RESPONSE: {
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

    case REQUEST_PROFILE_PAGE_DATA: {
      return state.setIn(['profilePage', 'isFetching'], true);
    }

    case REQUEST_PROFILE_PAGE_DATA_RESPONSE: {
      return state.mergeIn(['profilePage'], {
        isFetching: false,
        didInvalidate: false,
        firstName: action.data.user.name,
        lastName: action.data.user.lastname,
        regDate: action.data.user.regDate,
      });
    }

    case REQUEST_FRIENDS_PAGE_DATA: {
      return state.setIn(['friendsPage', 'isFetching'], true);
    }

    case REQUEST_FRIENDS_PAGE_DATA_RESPONSE: {
      return state.mergeIn(['friendsPage'], {
        isFetching: false,
        didInvalidate: false,
        inbox: action.data.friendships.incoming,
        outbox: action.data.friendships.outcoming,
        friends: action.data.friendships.friends,
      });
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
