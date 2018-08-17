import classNames from 'classnames';
import React from 'react';
import { Link } from 'react-router-dom';
import * as ProfilePath from '../ProfilePage/profilePath';

export enum FriendshipItemType {
  INCOMING,
  OUTGOING,
}

export interface IFriendshipItem {
  friendshipKey: string;
  userFullName: string;
  userId: string;
}
interface IFriendshipItemProps extends IFriendshipItem {
  type: FriendshipItemType;
  onClick(key: string): void;
}

export default class FriendshipItem extends React.PureComponent<IFriendshipItemProps> {
  constructor(props: IFriendshipItemProps) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  public render() {
    const props = this.props;
    const buttonClassNames = classNames('fa', getIconClassNameByType(props.type));

    return (
      <li>
        <Link to={ProfilePath.getLinkForUserId(props.userId)}>{props.userFullName}</Link>
        <div className="control">
          <button
            className="clear"
            onClick={this.onClick}
          >
            <i className={buttonClassNames}/>
          </button>
        </div>
      </li>
    );
  }

  private onClick() {
    this.props.onClick(this.props.friendshipKey);
  }
}

function getIconClassNameByType(type: FriendshipItemType): string {
  switch (type) {
    case FriendshipItemType.INCOMING:
      return 'fa-check';

    case FriendshipItemType.OUTGOING:
      return 'fa-times';
  }
}
