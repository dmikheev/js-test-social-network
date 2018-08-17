import debounce from 'lodash/debounce';
import findKey from 'lodash/findKey';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { acceptFriendship, declineFriendship, requestFriendship } from '../../../data/actions/friendshipActions';
import { findUsers, invalidateSearchResults } from '../../../data/actions/userActions';
import { IFriendshipsState } from '../../../data/reducers/entites/IFriendshipsState';
import { IUsersState } from '../../../data/reducers/entites/IUsersState';
import { getUserFullName } from '../../../data/reducers/entites/usersHelpers';
import { IAppState } from '../../../data/reducers/IAppState';
import CheckAuthPage from '../../common/CheckAuthPage';
import { ISearchItem } from './SearchItem';
import { SearchItemFriendshipStatus } from './searchItemFriendshipStatus';
import SearchPage from './SearchPage';

const FIND_USERS_DEBOUNCE_TIME = 250;

interface ISearchPageContainerStateProps {
  currentUserId?: string;
  didInvalidate: boolean;
  foundUsers?: string[];
  friendships: IFriendshipsState;
  isFetching: boolean;
  itemsPerPage?: number;
  pageNum: number;
  totalItemsCount?: number;
  users: IUsersState;
}
interface ISearchPageContainerDispatchProps {
  findUsers(searchQuery?: string, pageNum?: number): void;
  invalidateSearchResults(): void;
  requestFriendship(receiverId: string): void;
  acceptFriendship(friendshipKey: string): void;
  declineFriendship(friendshipKey: string): void;
}

type ISearchPageContainerProps = ISearchPageContainerStateProps & ISearchPageContainerDispatchProps;
class SearchPageContainer extends React.PureComponent<ISearchPageContainerProps> {
  private findUsersDebounced: (searchQuery?: string, pageNum?: number) => void;

  constructor(props: ISearchPageContainerProps) {
    super(props);

    this.findUsersDebounced = debounce(props.findUsers, FIND_USERS_DEBOUNCE_TIME);

    this.onQueryInput = this.onQueryInput.bind(this);
    this.onSearchItemButtonClick = this.onSearchItemButtonClick.bind(this);
  }

  public componentDidMount() {
    this.props.findUsers();
  }

  public componentWillUnmount() {
    this.props.invalidateSearchResults();
  }

  public render() {
    const props = this.props;
    let searchItems: ISearchItem[] = [];
    if (props.currentUserId && !props.didInvalidate) {
      const foundUsersWithNames = populateUserNames(props.foundUsers!, props.users);
      searchItems = populateFriendships(foundUsersWithNames, props.currentUserId, props.friendships);
    }

    return (
      <SearchPage
        items={searchItems}
        onQueryInput={this.onQueryInput}
        onSearchItemButtonClick={this.onSearchItemButtonClick}
      />
    );
  }

  private onQueryInput(searchQuery: string) {
    this.findUsersDebounced(searchQuery);
  }

  private onSearchItemButtonClick(searchItem: ISearchItem) {
    switch (searchItem.status) {
      case SearchItemFriendshipStatus.NONE:
        return this.props.requestFriendship(searchItem.userId);

      case SearchItemFriendshipStatus.INCOMING:
        return this.props.acceptFriendship(searchItem.friendshipKey!);

      case SearchItemFriendshipStatus.OUTGOING:
      case SearchItemFriendshipStatus.FRIEND:
        return this.props.declineFriendship(searchItem.friendshipKey!);
    }
  }
}

type MapStateToPropsFunc = (state: IAppState) => ISearchPageContainerStateProps;
const mapStateToProps: MapStateToPropsFunc = (state) => ({
  currentUserId: state.auth.userId,
  didInvalidate: state.searchPage.didInvalidate,
  foundUsers: state.searchPage.foundUsers,
  friendships: state.entities.friendships,
  isFetching: state.searchPage.isFetching,
  itemsPerPage: state.searchPage.itemsPerPage,
  pageNum: state.searchPage.pageNum,
  totalItemsCount: state.searchPage.totalItemsCount,
  users: state.entities.users,
});

type MapDispatchToPropsFunc = (dispatch: Dispatch) => ISearchPageContainerDispatchProps;
const mapDispatchToProps: MapDispatchToPropsFunc = (dispatch) => bindActionCreators({
  acceptFriendship,
  declineFriendship,
  findUsers,
  invalidateSearchResults,
  requestFriendship,
}, dispatch);

export default CheckAuthPage(true)(connect(mapStateToProps, mapDispatchToProps)(SearchPageContainer));

interface IFoundUsersWithNames {
  userFullName: string;
  userId: string;
}
function populateUserNames(foundUsers: string[], users: IUsersState): IFoundUsersWithNames[] {
  return foundUsers.map((userId) => {
    const userData = users[userId];
    if (!userData || !userData.data) {
      throw new Error(`Unable to find user with id "${userId}" in SearchPageContainer`);
    }

    return {
      userId,
      userFullName: getUserFullName(userData.data),
    };
  });
}

function populateFriendships(
  foundUsers: IFoundUsersWithNames[],
  currentUserId: string,
  friendships: IFriendshipsState,
): ISearchItem[] {
  return foundUsers.map((userItem) => {
    if (userItem.userId === currentUserId) {
      return {
        ...userItem,
        status: SearchItemFriendshipStatus.SELF,
      };
    }

    const incomingFriendshipKey = findKey(
      friendships,
      (friendshipState) => !!friendshipState.data && friendshipState.data.senderId === userItem.userId &&
        friendshipState.data.receiverId === currentUserId,
    );
    if (incomingFriendshipKey) {
      const friendship = friendships[incomingFriendshipKey].data!;

      return {
        ...userItem,
        friendshipKey: incomingFriendshipKey,
        status: friendship.isAccepted ? SearchItemFriendshipStatus.FRIEND : SearchItemFriendshipStatus.INCOMING,
      };
    }

    const outgoingFriendshipKey = findKey(
      friendships,
      (friendshipState) => friendshipState.data && friendshipState.data.senderId === currentUserId &&
        friendshipState.data.receiverId === userItem.userId,
    );
    if (outgoingFriendshipKey) {
      const friendship = friendships[outgoingFriendshipKey].data!;

      return {
        ...userItem,
        friendshipKey: outgoingFriendshipKey,
        status: friendship.isAccepted ? SearchItemFriendshipStatus.FRIEND : SearchItemFriendshipStatus.OUTGOING,
      };
    }

    return {
      ...userItem,
      status: SearchItemFriendshipStatus.NONE,
    };
  });
}
