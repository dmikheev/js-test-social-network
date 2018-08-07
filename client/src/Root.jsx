import React from 'react';
import { hot } from 'react-hot-loader';
import { Redirect, Route, HashRouter, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './components/App';
import LoginPage from './components/pages/LoginPage/LoginPage';
import ProfilePage from './components/pages/ProfilePage/ProfilePage';
import FriendsPage from './components/pages/FriendsPage/FriendsPage';
import SearchPage from './components/pages/SearchPage/SearchPage';
import loginPath from "./components/pages/LoginPage/loginPath";
import friendsPath from "./components/pages/FriendsPage/friendsPath";
import profilePath, { routerPath as profilePathWithParam } from './components/pages/ProfilePage/profilePath';
import searchPath from "./components/pages/SearchPage/searchPath";
import store from './store';

import './root.css';

function Root() {
  return (
    <Provider store={store}>
      <HashRouter>
        <App>
          <Switch>
            <Route path={loginPath} component={LoginPage} />
            <Route path={profilePathWithParam} component={ProfilePage} />
            <Route path={friendsPath} component={FriendsPage} />
            <Route path={searchPath} component={SearchPage} />
            <Redirect path="*" to={profilePath} />
          </Switch>
        </App>
      </HashRouter>
    </Provider>
  );
}
export default hot(module)(Root);
