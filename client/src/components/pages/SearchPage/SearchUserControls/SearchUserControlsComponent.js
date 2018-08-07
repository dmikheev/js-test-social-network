import PropTypes from 'prop-types';
import React from 'react';
import values from 'lodash/values';
import { SEARCH_USER_FRIENDSHIP_STATUSES } from '../searchUserFriendshipStatuses';

export default function SearchUserControlsComponent(props) {
  return (
    <div className="control">
      <button className="clear" onClick={props.onButtonClick}>
        {getSearchUserButtonByFriendshipStatus(props.userFriendshipStatus)}
      </button>
    </div>
  );
}
SearchUserControlsComponent.propTypes = {
  userFriendshipStatus: PropTypes.oneOf(values(SEARCH_USER_FRIENDSHIP_STATUSES)).isRequired,
  onButtonClick: PropTypes.func,
};

function getSearchUserButtonByFriendshipStatus(status) {
  switch (status) {
    case SEARCH_USER_FRIENDSHIP_STATUSES.SELF:
      return null;

    case SEARCH_USER_FRIENDSHIP_STATUSES.NONE:
      return <i className="fa fa-plus" />;

    case SEARCH_USER_FRIENDSHIP_STATUSES.RECEIVED:
      return <i className="fa fa-check" />;

    case SEARCH_USER_FRIENDSHIP_STATUSES.REQUESTED:
    case SEARCH_USER_FRIENDSHIP_STATUSES.FRIEND:
      return <i className="fa fa-times" />;
  }

  console.error('Unknown friendship status in SearchUserControlsComponent::getSearchUserButtonByFriendshipStatus!');
  return null;
}
