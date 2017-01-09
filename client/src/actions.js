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
  return !state.getIn(['authorization', 'isChecked']) && !state.getIn(['authorization', 'isFetching']);
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
