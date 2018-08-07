import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import Navigation from '../../Navigation';
import CheckAuthorizePage from '../../common/CheckAuthorizePage';
import * as Actions from '../../../actions';

class FriendsPage extends React.PureComponent {
  componentDidMount() {
    if (this.props.didInvalidate) {
      this.props.onDataInvalidate();
    }
  }

  render() {
    if (this.props.didInvalidate) {
      return <div>Loading...</div>;
    }

    return (
      <div className="ui">
        <Navigation/>
        <div className="page-wrapper">
          <div className="page">
            <div className="grid-container">
              <div className="grid-column col-50">
                <div className="substrate">
                  <h1>Inbox</h1>
                  <div className="list-of-users">
                    <ul>
                      {this.props.inbox.map((friendship) => (
                        <li key={friendship.sender.id}>
                          <a href="/">{friendship.sender.name} {friendship.sender.lastname}</a>
                          <div className="control">
                            <button
                              className="clear"
                              onClick={() => this.props.onFriendshipRequestAcceptClick(friendship.id)}
                            >
                              <i className="fa fa-check" />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="grid-column col-50">
                <div className="substrate">
                  <h1>Outbox</h1>
                  <div className="list-of-users">
                    <ul>
                      {this.props.outbox.map((friendship) => (
                        <li key={friendship.receiver.id}>
                          <a href="/">{friendship.receiver.name} {friendship.receiver.lastname}</a>
                          <div className="control">
                            <button
                              className="clear"
                              onClick={() => this.props.onFriendshipRequestRemoveClick(friendship.id)}
                            >
                              <i className="fa fa-times" />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="grid-column">
                <div className="substrate">
                  <h1>My Friends</h1>
                  <div className="list-of-users">
                    <ul>
                      {this.props.friends.map((friendship) => {
                        const anotherUser = friendship.sender.id === this.props.currentUserId ?
                          friendship.receiver : friendship.sender;

                        return (
                          <li key={anotherUser.id}>
                            <a href="/">{anotherUser.name} {anotherUser.lastname}</a>
                            <div className="control">
                              <button
                                className="clear"
                                onClick={() => this.props.onFriendshipRemoveClick(friendship.id)}
                              >
                                <i className="fa fa-times" />
                              </button>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
FriendsPage.propTypes = {
  currentUserId: PropTypes.string.isRequired,
  didInvalidate: PropTypes.bool.isRequired,
  friends: PropTypes.array.isRequired,
  inbox: PropTypes.array.isRequired,
  outbox: PropTypes.array.isRequired,

  onDataInvalidate: PropTypes.func.isRequired,
  onFriendshipRemoveClick: PropTypes.func.isRequired,
  onFriendshipRequestAcceptClick: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  const friendsPageState = state.getIn(['friendsPage']).toJS();

  return {
    currentUserId: state.getIn(['authorization', 'userId']),
    didInvalidate: friendsPageState.didInvalidate,
    friends: friendsPageState.friends,
    inbox: friendsPageState.inbox,
    outbox: friendsPageState.outbox,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onDataInvalidate() {
      dispatch(Actions.fetchFriendsPageDataIfNeeded());
    },
    onFriendshipRequestAcceptClick(friendshipId) {
      dispatch(Actions.requestAcceptFriendship(friendshipId));
    },
    onFriendshipRequestRemoveClick(friendshipId) {
      dispatch(Actions.requestRemoveFriendshipRequest(friendshipId));
    },
    onFriendshipRemoveClick(friendshipId) {
      dispatch(Actions.requestRemoveFriendship(friendshipId));
    },
  };
}

export default CheckAuthorizePage(true)(connect(mapStateToProps, mapDispatchToProps)(FriendsPage));
