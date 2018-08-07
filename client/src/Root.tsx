import React from 'react';
import { hot } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';
import App from './components/App';
import FriendsPage from './components/pages/FriendsPage/FriendsPage';
import friendsPath from './components/pages/FriendsPage/friendsPath';
import LoginPage from './components/pages/LoginPage/LoginPage';
import loginPath from './components/pages/LoginPage/loginPath';
import ProfilePage from './components/pages/ProfilePage/ProfilePage';
import profilePath, { routerPath as profilePathWithParam } from './components/pages/ProfilePage/profilePath';
import SearchPage from './components/pages/SearchPage/SearchPage';
import searchPath from './components/pages/SearchPage/searchPath';
import store from './store';

import './root.css';

const Root: React.StatelessComponent = () => (
  <Provider store={store}>
    <HashRouter>
      <App>
        <Switch>
          <Route path={loginPath} component={LoginPage}/>
          <Route path={profilePathWithParam} component={ProfilePage}/>
          <Route path={friendsPath} component={FriendsPage}/>
          <Route path={searchPath} component={SearchPage}/>
          <Redirect path="*" to={profilePath}/>
        </Switch>
      </App>
    </HashRouter>
  </Provider>
);
export default hot(module)(Root);
