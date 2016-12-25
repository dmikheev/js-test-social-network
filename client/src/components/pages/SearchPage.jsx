import React from 'react';

import Navigation from '../Navigation';

export default class SearchPage extends React.Component {
  static getPath() {
    return '/search';
  };

  render() {
    return (
      <div className="ui">
        <Navigation/>
        <div className="page-wrapper">
          <div className="page">
            <div className="grid-container">
              <div className="grid-column col-60">
                <div className="substrate">
                  <div className="textbox icon"><i className="fa fa-search"></i>
                    <input type="text" placeholder="Enter your user name ..."/>
                  </div>
                  <div className="list-of-users">
                    <ul>
                      <li><a href="/"><span>Vladimir Zhirinovsky</span></a>
                        <div className="control">
                          <button className="clear"><i className="fa fa-times"></i></button>
                        </div>
                      </li>
                      <li><a href="/"><span>James Bond</span></a>
                        <div className="control">
                          <button className="clear"><i className="fa fa-plus"></i></button>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
