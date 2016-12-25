import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import LoginPage from '../pages/LoginPage';
import ProfilePage from '../pages/ProfilePage';

const REDIRECT_UNAUTH_PATH = LoginPage.getPath();
const REDIRECT_AUTH_PATH = ProfilePage.getPath();

export default (isPageForAuthUsers) => (WrappedComponent) => {
  class CheckAuthorizePage extends React.Component {
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
      if (!this.props.isAuthChecked || this.props.isUserAuthorized === isPageForAuthUsers) {
        return;
      }

      this.props.router.push(isPageForAuthUsers ? REDIRECT_UNAUTH_PATH : REDIRECT_AUTH_PATH);
    }
  }

  function mapStateToProps(state) {
    return {
      isAuthChecked: state.authorization.isChecked,
      isUserAuthorized: state.authorization.isUserAuthorized,
    };
  }

  return connect(mapStateToProps)(withRouter(CheckAuthorizePage));
}
