export const REQUEST_AUTHORIZATION_CHECK = 'REQUEST_AUTHORIZATION_CHECK';
function requestAuthorizationCheck() {
  return {
    type: REQUEST_AUTHORIZATION_CHECK,
  }
}

export const HANDLE_AUTHORIZATION_CHECK_RESPONSE = 'HANDLE_AUTHORIZATION_CHECK_RESPONSE';
function handleAuthorizationCheckResponse(isUserAuthorized) {
  return {
    type: HANDLE_AUTHORIZATION_CHECK_RESPONSE,
    data: { isUserAuthorized },
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
      .then(response => dispatch(handleAuthorizationCheckResponse(response.ok)));
  };
}

export const HANDLE_AUTHORIZATION_RESPONSE = 'HANDLE_AUTHORIZATION_RESPONSE';
function handleAuthorizationResponse(data) {
  return {
    type: HANDLE_AUTHORIZATION_RESPONSE,
    data,
  };
}

export function sendAuthorizationRequest(login, pass, firstName, lastName) {
  return (dispatch) => {
    return fetch('/api/auth', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        login,
        pass,
        name: firstName,
        lastname: lastName,
      }),
    })
      .then(response => (response.ok ? response.json() : null))
      .then(json => dispatch(handleAuthorizationResponse(json)));
  };
}

export const REQUEST_PROFILE_PAGE_DATA = 'REQUEST_PROFILE_PAGE_DATA';
function requestProfilePageData() {
  return {
    type: REQUEST_PROFILE_PAGE_DATA,
  }
}

export const REQUEST_PROFILE_PAGE_DATA_RESPONSE = 'REQUEST_PROFILE_PAGE_DATA_RESPONSE';
function requestProfilePageDataResponse(user) {
  return {
    type: REQUEST_PROFILE_PAGE_DATA_RESPONSE,
    data: { user },
  }
}

function fetchProfilePageData() {
  return dispatch => {
    dispatch(requestProfilePageData());
    return fetch('/api/user/get', {
      credentials: 'same-origin',
    })
      .then(response => response.json())
      .then(json => dispatch(requestProfilePageDataResponse(json)));
  }
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
      return dispatch(fetchProfilePageData())
    } else {
      return Promise.resolve()
    }
  }
}
