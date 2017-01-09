import React from 'react';
import CheckAuthorizePage from '../../common/CheckAuthorizePage';
import {connect} from 'react-redux';
import {sendAuthorizationRequest} from '../../../actions';

class LoginPage extends React.Component {
  constructor(...args) {
    super(...args);

    this.state = {
      login: '',
      pass: '',
      name: '',
      lastname: '',
    };

    this.onInput = this.onInput.bind(this);
    this.onButtonClick = this.onButtonClick.bind(this);
  }

  onInput(event) {
    this.setState({
      [event.target.id]: event.target.value,
    });
  }

  onButtonClick() {
    this.props.onButtonClick(this.state.login, this.state.pass, this.state.name, this.state.lastname);
  }

  render() {
    return (
      <div className="ui">
        <div className="pattern-cell login">
          <div>
            <div className="substrate">
              <div className="textbox">
                <input id="name" type="text" placeholder="Name" onInput={this.onInput} />
              </div>
              <div className="textbox">
                <input id="lastname" type="text" placeholder="Last name" onInput={this.onInput} />
              </div>
              <div className="textbox icon"><i className="fa fa-user"></i>
                <input id="login" type="text" placeholder="Login" onInput={this.onInput} />
              </div>
              <div className="textbox icon"><i className="fa fa-lock"></i>
                <input id="pass" type="password" placeholder="Password" onInput={this.onInput} />
              </div>
              <button id="button" className="rectangular green" onClick={this.onButtonClick}>
                <i className="fa fa-sign-in" />
                <span>Log In</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onButtonClick(login, pass, name, lastName) {
      dispatch(sendAuthorizationRequest(login, pass, name, lastName));
    },
  };
}

export default CheckAuthorizePage(false)(connect(null, mapDispatchToProps)(LoginPage));
