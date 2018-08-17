import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';

import './css/global.css';
import './ui/app.css';

import HotReloadRoot from './HotReloadRoot';

ReactDOM.render(
  <HotReloadRoot/>,
  document.getElementById('app'),
);
