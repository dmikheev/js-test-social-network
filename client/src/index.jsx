import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, Redirect, hashHistory} from 'react-router';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';
import reducer from './reducer';
import App from './components/App';
import LoginPage from './components/pages/LoginPage/LoginPage';
import ProfilePage from './components/pages/ProfilePage/ProfilePage';
import FriendsPage from './components/pages/FriendsPage/FriendsPage';
import SearchPage from './components/pages/SearchPage/SearchPage';
import loginPath from "./components/pages/LoginPage/loginPath";
import friendsPath from "./components/pages/FriendsPage/friendsPath";
import profilePath, { routerPath as profilePathWithParam } from './components/pages/ProfilePage/profilePath';
import searchPath from "./components/pages/SearchPage/searchPath";
import './root.css';
import './css/global.css';

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunkMiddleware)));

ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path="" component={App}>
        <Route path={loginPath} component={LoginPage} />
        <Route path={profilePathWithParam} component={ProfilePage} />
        <Route path={friendsPath} component={FriendsPage} />
        <Route path={searchPath} component={SearchPage} />
        <Redirect from="/" to={profilePath} />
        <Redirect from="/*" to={profilePath} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
);
