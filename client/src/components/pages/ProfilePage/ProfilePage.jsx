import React from 'react';
import Navigation from '../../Navigation';
import CheckAuthorizePage from "../../common/CheckAuthorizePage";
import {connect} from 'react-redux';
import {fetchProfilePageDataIfNeeded} from '../../../actions';

class ProfilePage extends React.PureComponent {
  componentDidMount() {
    if (this.props.didInvalidate) {
      this.props.onDataInvalidate();
    }
  }

  render() {
    if (this.props.didInvalidate) {
      return <div>Loading...</div>;
    }

    return (
      <div className="ui">
        <Navigation />
        <div className="page-wrapper">
          <div className="page">
            <div className="grid-container">
              <div className="grid-column col-60">
                <div className="substrate">
                  <h1 id="name">{this.props.firstName} {this.props.lastName}</h1>
                  <p>Date of registration: <span id="regDate">{this.props.regDate}</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return state.getIn(['profilePage']).toJS();
}

function mapDispatchToProps(dispatch) {
  return {
    onDataInvalidate() {
      dispatch(fetchProfilePageDataIfNeeded());
    }
  };
}

export default CheckAuthorizePage(true)(connect(mapStateToProps, mapDispatchToProps)(ProfilePage));
