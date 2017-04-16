import React from 'react';
import rootStyles from '../root.css';

export default class App extends React.Component {
  render() {
    return (
      <div id="page" className={rootStyles.page}>
        {this.props.children}
      </div>
    );
  }
}
