import { combineReducers } from 'redux';
import friendships from './friendshipsReducer';
import { IEntitiesState } from './IEntitiesState';
import users from './usersReducer';

const entitiesReducer = combineReducers<IEntitiesState>({
  friendships,
  users,
});
export default entitiesReducer;
