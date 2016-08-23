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

const store = createStore(reducer);

ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path="" component={App}>
        <Route path="/login" component={LoginPage} />
        <Route path="/profile" component={ProfilePage} />
        <Route path="/friends" component={FriendsPage} />
        <Route path="/search" component={SearchPage} />
        <Redirect from="/" to="/profile" />
        <Redirect from="/*" to="/profile" />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
);
