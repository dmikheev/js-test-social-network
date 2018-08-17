import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import FriendsPageContainer from './pages/FriendsPage/FriendsPageContainer';
import friendsPath from './pages/FriendsPage/friendsPath';
import LoginPageContainer from './pages/LoginPage/LoginPageContainer';
import loginPath from './pages/LoginPage/loginPath';
import ProfilePageContainer from './pages/ProfilePage/ProfilePageContainer';
import profilePath, { routerPath as profilePathWithParam } from './pages/ProfilePage/profilePath';
import SearchPageContainer from './pages/SearchPage/SearchPageContainer';
import searchPath from './pages/SearchPage/searchPath';

import styles from './app.css';

const App: React.StatelessComponent = () => (
  <BrowserRouter>
    <div id="page" className={styles.page}>
      <Switch>
        <Route path={loginPath} component={LoginPageContainer}/>
        <Route path={profilePathWithParam} component={ProfilePageContainer}/>
        <Route path={friendsPath} component={FriendsPageContainer}/>
        <Route path={searchPath} component={SearchPageContainer}/>
        <Redirect path="*" to={profilePath}/>
      </Switch>
    </div>
  </BrowserRouter>
);
export default App;
