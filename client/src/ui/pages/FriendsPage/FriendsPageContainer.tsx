import each from 'lodash/each';
import mapValues from 'lodash/mapValues';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { acceptFriendship, declineFriendship, getFriendships } from '../../../data/actions/friendshipActions';
import { IFriendshipsState } from '../../../data/reducers/entites/IFriendshipsState';
import { IUsersState } from '../../../data/reducers/entites/IUsersState';
import { getUserFullName } from '../../../data/reducers/entites/usersHelpers';
import { IAppState } from '../../../data/reducers/IAppState';
import CheckAuthPage from '../../common/CheckAuthPage';
import { IFriendshipItem } from './FriendshipItem';
import FriendsPage from './FriendsPage';

interface IFriendsPageContainerStateProps {
  currentUserId: string;
  didInvalidate: boolean;
  friendships: IFriendshipsState;
  users: IUsersState;
}
interface IFriendsPageContainerDispatchProps {
  getFriendships(): void;
  acceptFriendship(key: string): void;
  declineFriendship(key: string): void;
}

type IFriendsPageContainerProps = IFriendsPageContainerStateProps & IFriendsPageContainerDispatchProps;
class FriendsPageContainer extends React.PureComponent<IFriendsPageContainerProps> {
  public componentDidMount() {
    this.props.getFriendships();
  }

  public render() {
    const props = this.props;
    if (props.didInvalidate) {
      return <div>Loading...</div>;
    }

    const classifiedFriendships = classifyFriendships(props.friendships, props.currentUserId);
    const populatedFriendshipItems = populateFriendships(classifiedFriendships, props.users);

    return (
      <FriendsPage
        inbox={populatedFriendshipItems.inbox}
        outbox={populatedFriendshipItems.outbox}
        friends={populatedFriendshipItems.friends}
        onFriendshipAcceptClick={props.acceptFriendship}
        onFriendshipDeclineClick={props.declineFriendship}
      />
    );
  }
}

type MapStateToPropsFunc = (state: IAppState) => IFriendsPageContainerStateProps;
const mapStateToProps: MapStateToPropsFunc = (state) => ({
  currentUserId: state.auth.userId as string,
  didInvalidate: state.friendsPage.didInvalidate,
  friendships: state.entities.friendships,
  users: state.entities.users,
});

type MapDispatchToPropsFunc = (dispatch: Dispatch) => IFriendsPageContainerDispatchProps;
const mapDispatchToProps: MapDispatchToPropsFunc = (dispatch) => bindActionCreators({
  acceptFriendship,
  declineFriendship,
  getFriendships,
}, dispatch);

export default CheckAuthPage(true)(connect(mapStateToProps, mapDispatchToProps)(FriendsPageContainer));

interface IClassifyFriendshipsItem {
  friendshipKey: string;
  userId: string;
}
interface IClassifiedFriendships {
  inbox: IClassifyFriendshipsItem[];
  outbox: IClassifyFriendshipsItem[];
  friends: IClassifyFriendshipsItem[];
}
function classifyFriendships(friendships: IFriendshipsState, currentUserId: string): IClassifiedFriendships {
  const result: IClassifiedFriendships = {
    friends: [],
    inbox: [],
    outbox: [],
  };

  each(friendships, (friendship, key) => {
    if (!friendship.data) {
      return;
    }

    if (friendship.data.receiverId === currentUserId) {
      const friendshipItem = {
        friendshipKey: key,
        userId: friendship.data.senderId,
      };

      if (friendship.data.isAccepted) {
        result.friends.push(friendshipItem);
      } else {
        result.inbox.push(friendshipItem);
      }
    } else if (friendship.data.senderId === currentUserId) {
      const friendshipItem = {
        friendshipKey: key,
        userId: friendship.data.receiverId,
      };

      if (friendship.data.isAccepted) {
        result.friends.push(friendshipItem);
      } else {
        result.outbox.push(friendshipItem);
      }
    }
  });

  return result;
}

interface IPopulatedFriendshipItems {
  inbox: IFriendshipItem[];
  outbox: IFriendshipItem[];
  friends: IFriendshipItem[];
}
function populateFriendships(
  classifiedFriendships: IClassifiedFriendships,
  users: IUsersState,
): IPopulatedFriendshipItems {
  return mapValues(classifiedFriendships, (friendshipsCategory) => friendshipsCategory.map((friendship) => {
    const userState = users[friendship.userId];
    if (!userState) {
      throw new Error(
        `User with id "${friendship.userId}" not found in entities, friendshipKey - "${friendship.friendshipKey}"`,
      );
    }

    const user = userState.data;
    if (!user) {
      throw new Error(
        `User with id "${friendship.userId}" not loaded, friendshipKey - "${friendship.friendshipKey}"`,
      );
    }

    return {
      ...friendship,
      userFullName: getUserFullName(user),
    };
  }));
}
