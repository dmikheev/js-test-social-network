import React from 'react';
import Navigation from '../Navigation';
import CheckAuthorizePage from "../common/CheckAuthorizePage";

class ProfilePage extends React.Component {
  render() {
    return (
      <div className="ui">
        <Navigation />
        <div className="page-wrapper">
          <div className="page">
            <div className="grid-container">
              <div className="grid-column col-60">
                <div className="substrate">
                  <h1 id="name">Danil Chunikhin</h1>
                  <p>Date of registration: <span id="regDate">12/10/2014</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CheckAuthorizePage(true)(ProfilePage);
