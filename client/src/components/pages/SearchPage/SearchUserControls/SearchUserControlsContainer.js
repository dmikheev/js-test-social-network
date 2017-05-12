import React from 'react';
import { connect } from 'react-redux';
import values from 'lodash/values';
import { SEARCH_USER_FRIENDSHIP_STATUSES } from '../searchUserFriendshipStatuses';
import SearchUserControlsComponent from './SearchUserControlsComponent';
import * as Actions from '../../../../actions';


function mapDispatchToProps(dispatch, ownProps) {
  return {
    onButtonClick() {
      switch (ownProps.userFriendshipStatus) {
        case SEARCH_USER_FRIENDSHIP_STATUSES.NONE:
          return dispatch(Actions.sendRequestFriendshipRequest(ownProps.userId));

        case SEARCH_USER_FRIENDSHIP_STATUSES.RECEIVED:
          return dispatch(Actions.requestAcceptFriendship(ownProps.friendshipId));

        case SEARCH_USER_FRIENDSHIP_STATUSES.REQUESTED:
          return dispatch(Actions.requestRemoveFriendshipRequest(ownProps.friendshipId));

        case SEARCH_USER_FRIENDSHIP_STATUSES.FRIEND:
          return dispatch(Actions.requestRemoveFriendship(ownProps.friendshipId));
      }
    },
  };
}

const SearchUserControlsContainer = connect(null, mapDispatchToProps)(SearchUserControlsComponent);
SearchUserControlsContainer.propTypes = {
  userFriendshipStatus: React.PropTypes.oneOf(values(SEARCH_USER_FRIENDSHIP_STATUSES)).isRequired,
  friendshipId: React.PropTypes.string,
  userId: React.PropTypes.string,
};

export default SearchUserControlsContainer;
