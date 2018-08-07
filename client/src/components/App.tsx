import React from 'react';
import rootStyles from '../root.css';

const App: React.StatelessComponent = (props) => (
  <div id="page" className={rootStyles.page}>
    {props.children}
  </div>
);
export default App;
