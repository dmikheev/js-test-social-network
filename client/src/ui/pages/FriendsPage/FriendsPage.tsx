import React from 'react';
import Navigation from '../../Navigation';
import FriendshipItem, { FriendshipItemType, IFriendshipItem } from './FriendshipItem';

interface IFriendsPageProps {
  inbox: IFriendshipItem[];
  outbox: IFriendshipItem[];
  friends: IFriendshipItem[];

  onFriendshipAcceptClick(key: string): void;
  onFriendshipDeclineClick(key: string): void;
}

const FriendsPage: React.StatelessComponent<IFriendsPageProps> = (props) => {
  const inboxHtml = props.inbox.map((friendshipData) => (
    <FriendshipItem
      {...friendshipData}
      key={friendshipData.friendshipKey}
      type={FriendshipItemType.INCOMING}
      onClick={props.onFriendshipAcceptClick}
    />
  ));
  const outboxHtml = props.outbox.map((friendshipData) => (
    <FriendshipItem
      {...friendshipData}
      key={friendshipData.friendshipKey}
      type={FriendshipItemType.OUTGOING}
      onClick={props.onFriendshipDeclineClick}
    />
  ));
  const friendsHtml = props.friends.map((friendshipData) => (
    <FriendshipItem
      {...friendshipData}
      key={friendshipData.friendshipKey}
      type={FriendshipItemType.OUTGOING}
      onClick={props.onFriendshipDeclineClick}
    />
  ));

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
                    {inboxHtml}
                  </ul>
                </div>
              </div>
            </div>
            <div className="grid-column col-50">
              <div className="substrate">
                <h1>Outbox</h1>
                <div className="list-of-users">
                  <ul>
                    {outboxHtml}
                  </ul>
                </div>
              </div>
            </div>
            <div className="grid-column">
              <div className="substrate">
                <h1>My Friends</h1>
                <div className="list-of-users">
                  <ul>
                    {friendsHtml}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default FriendsPage;
