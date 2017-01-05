import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { PATHS } from '../../constants';

const REDIRECT_UNAUTH_PATH = PATHS.LOGIN;
const REDIRECT_AUTH_PATH = PATHS.PROFILE;

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
      if (!this.props.isAuthChecked || this.props.isUserAuthorized === isPageForAuthUsers) {
        return;
      }

      this.props.router.push(isPageForAuthUsers ? REDIRECT_UNAUTH_PATH : REDIRECT_AUTH_PATH);
    }
  }

  function mapStateToProps(state) {
    return {
      isAuthChecked: state.getIn(['authorization', 'isChecked']),
      isUserAuthorized: state.getIn(['authorization', 'isUserAuthorized']),
    };
  }

  return connect(mapStateToProps)(withRouter(CheckAuthorizePageComponent));
};
