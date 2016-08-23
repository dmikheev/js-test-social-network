import React from 'react';

export default class ProfilePage extends React.Component {
  render() {
    return (
      <div className="ui">
        <div className="navigation">
          <ul>
            <li className="active"><a href="/" className="button rectangular"><i className="fa fa-user"></i><span>Friends</span></a></li>
            <li><a href="/" className="button rectangular"><i className="fa fa-search"></i><span>Search</span></a></li>
          </ul>
        </div>
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
