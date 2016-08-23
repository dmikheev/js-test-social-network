import React from 'react';

export default class SearchPage extends React.Component {
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
