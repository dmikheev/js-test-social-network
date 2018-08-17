import React from 'react';
import { hot } from 'react-hot-loader';
import { Provider } from 'react-redux';
import store from './store';
import App from './ui/App';

const HotReloadRoot: React.StatelessComponent = () => (
  <Provider store={store}>
    <App/>
  </Provider>
);
export default hot(module)(HotReloadRoot);
