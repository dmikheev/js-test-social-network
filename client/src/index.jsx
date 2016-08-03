import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, Redirect, hashHistory} from 'react-router';
import {createStore} from 'redux';
import {Provider} from 'react-redux';

import reducer from './reducer';
import App from './components/App';

const store = createStore(reducer);

ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path="" component={App}>
        <Route path="/login" />
        <Route path="/profile" />
        <Route path="/friends" />
        <Route path="/search" />
        <Redirect from="/" to="/profile" />
        <Redirect from="/*" to="/profile" />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
);
