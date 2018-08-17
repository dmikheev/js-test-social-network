import { applyMiddleware, createStore, Middleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './data/reducers/rootReducer';
import { DEV } from './utils/env';

const middlewares: Middleware[] = [];
middlewares.push(thunk);

if (DEV) {
  // tslint:disable-next-line:no-var-requires
  const createLogger = require('redux-logger').createLogger;

  middlewares.push(createLogger({
    duration: true,
  }));
}

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(...middlewares)));
if (module.hot) {
  module.hot.accept('./data/reducers/rootReducer', () => {
    const nextRootReducer = require('./data/reducers/rootReducer').default;
    store.replaceReducer(nextRootReducer);
  });
}

export default store;
