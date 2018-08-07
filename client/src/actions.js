export const REQUEST_AUTHORIZATION_CHECK = 'REQUEST_AUTHORIZATION_CHECK';
function requestAuthorizationCheck() {
  return {
    type: REQUEST_AUTHORIZATION_CHECK,
  };
}

export const HANDLE_AUTHORIZATION_CHECK_RESPONSE = 'HANDLE_AUTHORIZATION_CHECK_RESPONSE';
function handleAuthorizationCheckResponse(isUserAuthorized, user) {
  return {
    data: { isUserAuthorized, user },
    type: HANDLE_AUTHORIZATION_CHECK_RESPONSE,
  };
}

export function checkAuthorizationIfNeeded() {
  return (dispatch, getState) => {
    if (shouldCheckAuthorization(getState())) {
      return dispatch(checkAuthorization());
    } else {
      return Promise.resolve();
    }
  };
}
function shouldCheckAuthorization(state) {
  if (state.getIn(['authorization', 'isFetching'])) {
    return false;
  }

  return state.getIn(['authorization', 'didInvalidate']);
}
function checkAuthorization() {
  return (dispatch) => {
    dispatch(requestAuthorizationCheck());
    return fetch('/api/user/get', {
      credentials: 'same-origin',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('unauthorized');
        }

        return response.json();
      })
      .then(json => dispatch(handleAuthorizationCheckResponse(true, json)))
      .catch(() => dispatch(handleAuthorizationCheckResponse(false)));
  };
}

export const HANDLE_AUTHORIZATION_RESPONSE = 'HANDLE_AUTHORIZATION_RESPONSE';
function handleAuthorizationResponse(data) {
  return {
    data,
    type: HANDLE_AUTHORIZATION_RESPONSE,
  };
}

export function sendAuthorizationRequest(login, pass, firstName, lastName) {
  return (dispatch) => {
    return fetch('/api/auth', {
      body: JSON.stringify({
        lastname: lastName,
        login,
        name: firstName,
        pass,
      }),
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
      .then(response => (response.ok ? response.json() : null))
      .then(json => dispatch(handleAuthorizationResponse(json)));
  };
}

export const REQUEST_PROFILE_PAGE_DATA = 'REQUEST_PROFILE_PAGE_DATA';
function requestProfilePageData() {
  return {
    type: REQUEST_PROFILE_PAGE_DATA,
  };
}

export const REQUEST_PROFILE_PAGE_DATA_RESPONSE = 'REQUEST_PROFILE_PAGE_DATA_RESPONSE';
function requestProfilePageDataResponse(user) {
  return {
    data: { user },
    type: REQUEST_PROFILE_PAGE_DATA_RESPONSE,
  };
}

function fetchProfilePageData() {
  return dispatch => {
    dispatch(requestProfilePageData());
    return fetch('/api/user/get', {
      credentials: 'same-origin',
    })
      .then(response => response.json())
      .then(json => dispatch(requestProfilePageDataResponse(json)));
  };
}
function shouldFetchProfilePageData(state) {
  if (state.getIn(['profilePage', 'isFetching'])) {
    return false;
  }

  return state.getIn(['profilePage', 'didInvalidate']);
}
export function fetchProfilePageDataIfNeeded() {
  return (dispatch, getState) => {
    if (shouldFetchProfilePageData(getState())) {
      return dispatch(fetchProfilePageData());
    } else {
      return Promise.resolve();
    }
  };
}

export const REQUEST_FRIENDS_PAGE_DATA = 'REQUEST_FRIENDS_PAGE_DATA';
function requestFriendsPageData() {
  return {
    type: REQUEST_FRIENDS_PAGE_DATA,
  };
}

export const REQUEST_FRIENDS_PAGE_DATA_RESPONSE = 'REQUEST_FRIENDS_PAGE_DATA_RESPONSE';
function requestFriendsPageDataResponse(friendships) {
  return {
    data: { friendships },
    type: REQUEST_FRIENDS_PAGE_DATA_RESPONSE,
  };
}

function fetchFriendsPageData() {
  return dispatch => {
    dispatch(requestFriendsPageData());
    return fetch('/api/friendships/getAll', {
      credentials: 'same-origin',
    })
      .then(response => response.json())
      .then(json => dispatch(requestFriendsPageDataResponse(json)));
  };
}
function shouldFetchFriendsPageData(state) {
  if (state.getIn(['friendsPage', 'isFetching'])) {
    return false;
  }

  return state.getIn(['friendsPage', 'didInvalidate']);
}
export function fetchFriendsPageDataIfNeeded() {
  return (dispatch, getState) => {
    if (shouldFetchFriendsPageData(getState())) {
      return dispatch(fetchFriendsPageData());
    } else {
      return Promise.resolve();
    }
  };
}

export const REQUEST_FRIENDSHIP_RESPONSE = 'REQUEST_FRIENDSHIP_RESPONSE';
function requestFriendshipResponse(friendship) {
  return {
    data: friendship,
    type: REQUEST_FRIENDSHIP_RESPONSE,
  };
}

export function sendRequestFriendshipRequest(userId) {
  return (dispatch) =>
    fetch(`/api/friendship/request/${userId}`, {
      credentials: 'same-origin',
      method: 'POST',
    })
      .then(response => response.json())
      .then(json => dispatch(requestFriendshipResponse(json)));
}

export const ACCEPT_FRIENDSHIP_RESPONSE = 'ACCEPT_FRIENDSHIP_RESPONSE';
function acceptFriendshipResponse(friendship) {
  return {
    data: friendship,
    type: ACCEPT_FRIENDSHIP_RESPONSE,
  };
}

export function requestAcceptFriendship(friendshipId) {
  return (dispatch) =>
    fetch(`/api/friendship/accept/${friendshipId}`, {
      credentials: 'same-origin',
      method: 'POST',
    })
      .then(response => response.json())
      .then(json => dispatch(acceptFriendshipResponse(json)));
}

export const REMOVE_FRIENDSHIP_REQUEST_RESPONSE = 'REMOVE_FRIENDSHIP_REQUEST_RESPONSE';
const removeFriendshipRequestResponse = (friendshipId) => ({
  data: { id: friendshipId },
  type: REMOVE_FRIENDSHIP_REQUEST_RESPONSE,
});

export function requestRemoveFriendshipRequest(friendshipId) {
  return (dispatch) =>
    fetch(`/api/friendship/decline/${friendshipId}`, {
      credentials: 'same-origin',
      method: 'POST',
    })
      .then(response =>
        response.ok ?
          dispatch(removeFriendshipRequestResponse(friendshipId)) :
          Promise.reject(response));
}

export const REMOVE_FRIENDSHIP_RESPONSE = 'REMOVE_FRIENDSHIP_RESPONSE';
function removeFriendshipResponse(newFriendshipData) {
  return {
    data: newFriendshipData,
    type: REMOVE_FRIENDSHIP_RESPONSE,
  };
}

export function requestRemoveFriendship(friendshipId) {
  return (dispatch) =>
    fetch(`/api/friendship/decline/${friendshipId}`, {
      credentials: 'same-origin',
      method: 'POST',
    })
      .then(response => response.json())
      .then(json => dispatch(removeFriendshipResponse(json)));
}

export const UPDATE_SEARCH_USERS = 'UPDATE_SEARCH_USERS';
const updateSearchUsers = (users) => ({
  data: users,
  type: UPDATE_SEARCH_USERS,
});

export function requestUsersSearch(searchQuery) {
  return (dispatch) =>
    fetch(`/api/users/find/${searchQuery}`, {
      credentials: 'same-origin',
      method: 'GET',
    })
      .then(response => response.json())
      .then(json => dispatch(updateSearchUsers(json)));
}
