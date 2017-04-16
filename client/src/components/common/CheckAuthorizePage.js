import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import loginPath from "../pages/LoginPage/loginPath";
import profilePath from "../pages/ProfilePage/profilePath";
import {checkAuthorizationIfNeeded} from "../../actions";

const REDIRECT_UNAUTH_PATH = loginPath;
const REDIRECT_AUTH_PATH = profilePath;

export default (isPageForAuthUsers) => (WrappedComponent) => {
  class CheckAuthorizePageComponent extends React.Component {
    componentDidMount() {
      this.checkAuth();
    }

    componentDidUpdate() {
      this.checkAuth();
    }

    render() {
      if (!this.props.isAuthChecked) {
        return <div>Loading...</div>;
      }

      if (this.props.isUserAuthorized === isPageForAuthUsers) {
        return (
          <WrappedComponent {...this.props} />
        );
      }

      return null;
    }

    checkAuth() {
      if (!this.props.isAuthChecked) {
        this.props.checkAuthorization();
        return;
      }

      if (this.props.isUserAuthorized === isPageForAuthUsers) {
        return;
      }

      this.props.router.push(isPageForAuthUsers ? REDIRECT_UNAUTH_PATH : REDIRECT_AUTH_PATH);
    }
  }

  function mapStateToProps(state) {
    return {
      isAuthChecked: !state.getIn(['authorization', 'didInvalidate']),
      isUserAuthorized: state.getIn(['authorization', 'isUserAuthorized']),
    };
  }

  function mapDispatchToProps(dispatch) {
    return {
      checkAuthorization() {
        dispatch(checkAuthorizationIfNeeded());
      },
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)(withRouter(CheckAuthorizePageComponent));
};
