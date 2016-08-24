import React from 'react';

export default class Navigation extends React.Component {
  render() {
    return (
      <div className="navigation">
        <ul>
          <li className="active">
            <a href="/#/profile" className="button rectangular">
              <i className="fa fa-user"></i>
              <span>Profile</span>
            </a>
          </li>
          <li>
            <a href="/#/friends" className="button rectangular">
              <i className="fa fa-users"></i>
              <span>Friends</span>
            </a>
          </li>
          <li>
            <a href="/#/search" className="button rectangular">
              <i className="fa fa-search"></i>
              <span>Search</span>
            </a>
          </li>
        </ul>
      </div>
    );
  }
}
