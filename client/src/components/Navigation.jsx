import PropTypes from 'prop-types';
import React from 'react';
import { Link, withRouter } from "react-router";
import profilePath from "./pages/ProfilePage/profilePath";
import friendsPath from "./pages/FriendsPage/friendsPath";
import searchPath from "./pages/SearchPage/searchPath";

function NavigationComponent(props) {
  const navItems = [
    {
      href: profilePath,
      iconClass: 'fa-user',
      caption: 'Profile',
    },
    {
      href: friendsPath,
      iconClass: 'fa-users',
      caption: 'Friends',
    },
    {
      href: searchPath,
      iconClass: 'fa-search',
      caption: 'Search',
    },
  ];

  return (
    <div className="navigation">
      <ul>
        {
          navItems.map((item, idx) => (
            <Link
              key={item.href}
              to={item.href}
              className="button rectangular"
              activeClassName="active"
              onlyActiveOnIndex={false}
            >
              <i className={`fa ${item.iconClass}`} />
              {item.caption}
            </Link>
          ))
        }
      </ul>
    </div>
  );
}

NavigationComponent.propTypes = {
  router: PropTypes.object.isRequired,
};

export default withRouter(NavigationComponent);
