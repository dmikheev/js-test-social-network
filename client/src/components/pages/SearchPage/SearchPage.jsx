import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import Navigation from '../../Navigation';
import CheckAuthorizePage from "../../common/CheckAuthorizePage";
import { requestUsersSearch } from '../../../actions';
import SearchUserControls from './SearchUserControls/SearchUserControlsContainer';

class SearchPage extends React.PureComponent {
  constructor(){
    super(...arguments);

    this.state = {
      searchQuery: '',
    };

    this.onSearchQueryInput = this.onSearchQueryInput.bind(this);
  }

  componentDidMount() {
    this.props.onSearchQueryInput(this.state.searchQuery);
  }

  onSearchQueryInput(event) {
    this.setState({ searchQuery: event.target.value });
    this.props.onSearchQueryInput(event.target.value);
  }

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
                    <input
                      type="text"
                      placeholder="Enter your user name ..."
                      onInput={this.onSearchQueryInput}
                    />
                  </div>
                  <div className="list-of-users">
                    <ul>
                      {this.props.users.map((user) => (
                        <li key={user.id}>
                          <a href="/"><span>{user.name} {user.lastname}</span></a>
                          <SearchUserControls
                            userFriendshipStatus={user.status}
                            friendshipId={user.friendshipId}
                            userId={user.id}
                          />
                        </li>
                      ))}
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
SearchPage.propTypes = {
  users: PropTypes.array.isRequired,
  onSearchQueryInput: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return state.get('searchPage').toJS();
}

function mapDispatchToProps(dispatch) {
  return {
    onSearchQueryInput(searchQuery) {
      dispatch(requestUsersSearch(searchQuery));
    },
  };
}

export default CheckAuthorizePage(true)(connect(mapStateToProps, mapDispatchToProps)(SearchPage));
