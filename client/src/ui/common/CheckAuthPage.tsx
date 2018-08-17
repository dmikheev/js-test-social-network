import omit from 'lodash/omit';
import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { bindActionCreators, Dispatch } from 'redux';
import { checkAuthIfNeeded } from '../../data/actions/authActions';
import { IAppState } from '../../data/reducers/IAppState';
import loginPath from '../pages/LoginPage/loginPath';
import profilePath from '../pages/ProfilePage/profilePath';

const REDIRECT_UNAUTH_PATH = loginPath;
const REDIRECT_AUTH_PATH = profilePath;

interface ICheckAuthPageStateProps {
  isAuthChecked: boolean;
  isUserAuthorized: boolean;
}
interface ICheckAuthPageDispatchProps {
  checkAuthIfNeeded: () => void;
}

type ICheckAuthPageProps = ICheckAuthPageStateProps & ICheckAuthPageDispatchProps;
// tslint:disable-next-line:function-name
export default function CheckAuthPage<ChildProps>(isPageForAuthUsers: boolean) {
  return (WrappedComponent: React.ComponentClass<ChildProps>) => {
    class CheckAuthPageComponent extends React.PureComponent<ChildProps & ICheckAuthPageProps> {
      public componentDidMount() {
        this.checkAuth();
      }

      public componentDidUpdate() {
        this.checkAuth();
      }

      public render() {
        const props = this.props;
        const childProps = omit(props, 'isAuthChecked', 'isUserAuthorized', 'checkAuthIfNeeded');

        if (!props.isAuthChecked) {
          return <div>Loading...</div>;
        }

        if (props.isUserAuthorized === isPageForAuthUsers) {
          return (
            <WrappedComponent {...childProps}/>
          );
        }

        return isPageForAuthUsers ?
          <Redirect to={REDIRECT_UNAUTH_PATH}/> :
          <Redirect to={REDIRECT_AUTH_PATH}/>;
      }

      private checkAuth() {
        this.props.checkAuthIfNeeded();
      }
    }

    return connect(mapStateToProps, mapDispatchToProps)(CheckAuthPageComponent);
  };
}

type MapStateToPropsFunc = (state: IAppState) => ICheckAuthPageStateProps;
const mapStateToProps: MapStateToPropsFunc = (state) => ({
  isAuthChecked: !state.auth.didInvalidate,
  isUserAuthorized: !!state.auth.userId,
});

type MapDispatchToPropsFunc = (dispatch: Dispatch) => ICheckAuthPageDispatchProps;
const mapDispatchToProps: MapDispatchToPropsFunc = (dispatch) => bindActionCreators({
  checkAuthIfNeeded,
}, dispatch);
