import React from 'react';
import { NavLink } from "react-router-dom";
import profilePath from "./pages/ProfilePage/profilePath";
import friendsPath from "./pages/FriendsPage/friendsPath";
import searchPath from "./pages/SearchPage/searchPath";

function Navigation() {
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
          navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className="button rectangular"
              activeClassName="active"
            >
              <i className={`fa ${item.iconClass}`} />
              {item.caption}
            </NavLink>
          ))
        }
      </ul>
    </div>
  );
}

export default Navigation;
