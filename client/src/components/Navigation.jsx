import React from 'react';

function getNavPath() {
  const hash = location.hash;
  const queryStartIdx = hash.indexOf('?');
  return `/${queryStartIdx === -1 ? hash : hash.substring(0, queryStartIdx)}`;
}

export default function Navigation() {
  const navItems = [
    {
      href: '/#/profile',
      iconClass: 'fa-user',
      caption: 'Profile',
    },
    {
      href: '/#/friends',
      iconClass: 'fa-users',
      caption: 'Friends',
    },
    {
      href: '/#/search',
      iconClass: 'fa-search',
      caption: 'Search',
    },
  ];
  const curPath = getNavPath();

  return (
    <div className="navigation">
      <ul>
        {
          navItems.map((item, idx) => (
            <li className={`${curPath === item.href ? 'active' : ''}`} key={idx}>
              <a href={item.href} className="button rectangular">
                <i className={`fa ${item.iconClass}`}></i>
                {item.caption}
              </a>
            </li>
          ))
        }
      </ul>
    </div>
  );
}
