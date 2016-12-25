import React from 'react';

export default class LoginPage extends React.Component {
  static getPath() {
    return '/login';
  };

  render() {
    return (
      <div className="ui">
        <div className="pattern-cell login">
          <div>
            <div className="substrate">
              <div className="textbox">
                <input id="name" type="text" placeholder="Name"/>
              </div>
              <div className="textbox">
                <input id="lastname" type="text" placeholder="Last name"/>
              </div>
              <div className="textbox icon"><i className="fa fa-user"></i>
                <input id="login" type="text" placeholder="Login"/>
              </div>
              <div className="textbox icon"><i className="fa fa-lock"></i>
                <input id="pass" type="password" placeholder="Password"/>
              </div>
              <button id="button" className="rectangular green"><i className="fa fa-sign-in"></i><span>Log In</span></button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
