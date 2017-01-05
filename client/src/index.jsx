import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, Redirect, hashHistory} from 'react-router';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import reducer from './reducer';
import App from './components/App';
import LoginPage from './components/pages/LoginPage';
import ProfilePage from './components/pages/ProfilePage';
import FriendsPage from './components/pages/FriendsPage';
import SearchPage from './components/pages/SearchPage';
import {PATHS} from './constants';

const store = createStore(reducer);

ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path="" component={App}>
        <Route path={PATHS.LOGIN} component={LoginPage} />
        <Route path={PATHS.PROFILE} component={ProfilePage} />
        <Route path={PATHS.FRIENDS} component={FriendsPage} />
        <Route path={PATHS.SEARCH} component={SearchPage} />
        <Redirect from="/" to={PATHS.PROFILE} />
        <Redirect from="/*" to={PATHS.PROFILE} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
);
