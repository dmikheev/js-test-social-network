import { combineReducers, Reducer } from 'redux';
import auth from './authReducer';
import entities from './entites/entitiesReducer';
import friendsPage from './friendsPageReducer';
import { IAppState } from './IAppState';
import searchPage from './searchPageReducer';

const rootReducer: Reducer<IAppState> = combineReducers({
  auth,
  entities,
  friendsPage,
  searchPage,
});
export default rootReducer;
