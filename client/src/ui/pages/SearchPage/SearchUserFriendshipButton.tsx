import React from 'react';
import { SearchItemFriendshipStatus } from './searchItemFriendshipStatus';

interface ISearchUserFriendshipButtonProps {
  status: SearchItemFriendshipStatus;
  onClick(): void;
}
export default class SearchUserFriendshipButton extends React.PureComponent<ISearchUserFriendshipButtonProps> {
  public render() {
    const props = this.props;
    if (props.status === SearchItemFriendshipStatus.SELF) {
      return null;
    }

    return (
      <div className="control">
        <button className="clear" onClick={props.onClick}>
          {getButtonIconByStatus(props.status)}
        </button>
      </div>
    );
  }
}

function getButtonIconByStatus(status: SearchItemFriendshipStatus): JSX.Element {
  switch (status) {
    case SearchItemFriendshipStatus.NONE:
      return <i className="fa fa-plus" />;

    case SearchItemFriendshipStatus.INCOMING:
      return <i className="fa fa-check" />;

    case SearchItemFriendshipStatus.OUTGOING:
    case SearchItemFriendshipStatus.FRIEND:
      return <i className="fa fa-times" />;
  }

  throw new Error(`Unknown friendship status "${status}" in SearchUserFriendshipButton::getButtonIconByStatus!`);
}
