import React from 'react';
import rootStyles from '../root.css';

export default function App(props) {
  return (
    <div id="page" className={rootStyles.page}>
      {props.children}
    </div>
  );
}
