import React from 'react';

import Navigation from '../Navigation';

export default class FriendsPage extends React.Component {
  static getPath() {
    return '/friends';
  };

  render() {
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
                      <li><a href="/"><span>Konstantin Konstantinov</span></a>
                        <div className="control">
                          <button className="clear"><i className="fa fa-check"></i></button>
                          <button className="clear"><i className="fa fa-times"></i></button>
                        </div>
                      </li>
                      <li><a href="/"><span>Daniel Danilevsky</span></a>
                        <div className="control">
                          <button className="clear"><i className="fa fa-check"></i></button>
                          <button className="clear"><i className="fa fa-times"></i></button>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="grid-column col-50">
                <div className="substrate">
                  <h1>Outbox</h1>
                  <div className="list-of-users">
                    <ul>
                      <li><a href="/"><span>Nastassja Kotinskaya</span></a>
                        <div className="control">
                          <button className="clear"><i className="fa fa-times"></i></button>
                        </div>
                      </li>
                      <li><a href="/"><span>Luba Ljubasha</span></a>
                        <div className="control">
                          <button className="clear"><i className="fa fa-times"></i></button>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="grid-column">
                <div className="substrate">
                  <h1>My Friends</h1>
                  <div className="list-of-users">
                    <ul>
                      <li><a href="/"><span>Vladimir Zhirinovsky</span></a>
                        <div className="control">
                          <button className="clear"><i className="fa fa-times"></i><span>Remove from friends</span></button>
                        </div>
                      </li>
                      <li><a href="/"><span>Vladimir Putin</span></a>
                        <div className="control">
                          <button className="clear"><i className="fa fa-times"></i><span>Remove from friends</span></button>
                        </div>
                      </li>
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
