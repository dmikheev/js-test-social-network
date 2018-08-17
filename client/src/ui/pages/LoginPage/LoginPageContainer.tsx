import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { auth } from '../../../data/actions/authActions';
import CheckAuthPage from '../../common/CheckAuthPage';
import LoginPage from './LoginPage';

interface ILoginPageContainerDispatchProps {
  auth(login: string, pass: string, name: string, lastName: string): void;
}

type ILoginPageContainerProps = ILoginPageContainerDispatchProps;
interface ILoginPageContainerState {
  lastName: string;
  login: string;
  name: string;
  pass: string;
}

class LoginPageContainer extends React.PureComponent<ILoginPageContainerProps, ILoginPageContainerState> {
  constructor(props: ILoginPageContainerProps) {
    super(props);

    this.state = {
      lastName: '',
      login: '',
      name: '',
      pass: '',
    };

    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onValueChange = this.onValueChange.bind(this);
  }

  public render() {
    return (
      <LoginPage onFormSubmit={this.onFormSubmit} onValueChange={this.onValueChange}/>
    );
  }

  private onFormSubmit() {
    this.props.auth(this.state.login, this.state.pass, this.state.name, this.state.lastName);
  }

  private onValueChange(name: string, value: string) {
    this.setState({
      [name]: value,
    } as any);
  }
}

type MapDispathToPropsFunc = (dispatch: Dispatch) => ILoginPageContainerDispatchProps;
const mapDispatchToProps: MapDispathToPropsFunc = (dispatch) => bindActionCreators({
  auth,
}, dispatch);

export default CheckAuthPage(false)(
  connect(null, mapDispatchToProps)(LoginPageContainer),
);
