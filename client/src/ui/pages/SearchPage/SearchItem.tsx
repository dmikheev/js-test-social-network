import React from 'react';
import { Link } from 'react-router-dom';
import { getLinkForUserId } from '../ProfilePage/profilePath';
import { SearchItemFriendshipStatus } from './searchItemFriendshipStatus';
import SearchUserFriendshipButton from './SearchUserFriendshipButton';

export interface ISearchItem {
  friendshipKey?: string;
  status: SearchItemFriendshipStatus;
  userFullName: string;
  userId: string;
}

interface ISearchItemProps {
  item: ISearchItem;

  onButtonClick(searchItem: ISearchItem): void;
}

export default class SearchItem extends React.PureComponent<ISearchItemProps> {
  constructor(props: ISearchItemProps) {
    super(props);

    this.onButtonClick = this.onButtonClick.bind(this);
  }

  public render() {
    const props = this.props;

    return (
      <li>
        <Link to={getLinkForUserId(props.item.userId)}>{props.item.userFullName}</Link>
        <SearchUserFriendshipButton status={props.item.status} onClick={this.onButtonClick}/>
      </li>
    );
  }

  private onButtonClick() {
    this.props.onButtonClick(this.props.item);
  }
}
