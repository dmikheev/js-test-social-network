import React from 'react';
import { NavLink } from 'react-router-dom';
import friendsPath from './pages/FriendsPage/friendsPath';
import profilePath from './pages/ProfilePage/profilePath';
import searchPath from './pages/SearchPage/searchPath';

const navItems = [
  {
    caption: 'Profile',
    href: profilePath,
    iconClass: 'fa-user',
  },
  {
    caption: 'Friends',
    href: friendsPath,
    iconClass: 'fa-users',
  },
  {
    caption: 'Search',
    href: searchPath,
    iconClass: 'fa-search',
  },
];

const Navigation: React.StatelessComponent = () => {
  const linksHtml = navItems.map((item) => (
    <NavLink
      key={item.href}
      to={item.href}
      className="button rectangular"
      activeClassName="active"
    >
      <i className={`fa ${item.iconClass}`} />
      {item.caption}
    </NavLink>
  ));

  return (
    <div className="navigation">
      <ul>{linksHtml}</ul>
    </div>
  );
};
export default Navigation;
