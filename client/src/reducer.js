import {fromJS} from 'immutable';
import {
  REQUEST_AUTHORIZATION_CHECK,
  HANDLE_AUTHORIZATION_CHECK_RESPONSE,
  HANDLE_AUTHORIZATION_RESPONSE, REQUEST_PROFILE_PAGE_DATA, REQUEST_PROFILE_PAGE_DATA_RESPONSE
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

    default: return state;
  }
}

function getDefaultState() {
  return fromJS({
    authorization: {
      isFetching: false,
      didInvalidate: true,
      isUserAuthorized: null,
    },
    profilePage: {
      isFetching: false,
      didInvalidate: true,
      firstName: 'Danil',
      lastName: 'Chunikhin',
      regDate: '12/10/2014',
    },
    friendsPage: {
      inbox: ['1', '2'],
      outbox: ['3', '4'],
      friends: ['5', '6'],
      friendships: {

      },
    },
    searchPage: {
      users: [

      ],
    },
  });
}
