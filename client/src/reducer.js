import {fromJS} from 'immutable';

export default function(state, action) {
  if (!state) {
    return getDefaultState();
  }

  return state;
}

function getDefaultState() {
  return fromJS({
    authorization: {
      isChecked: false,
    }
  });
}
