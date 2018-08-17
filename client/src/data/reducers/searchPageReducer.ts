import { TAppAction } from '../actions/TAppAction';
import { UserActionType } from '../actions/userActions';
import { ISearchPageState } from './ISearchPageState';

const defaultState: ISearchPageState = {
  didInvalidate: true,
  isFetching: false,
  pageNum: 0,
};

export default function searchPageReducer(state = defaultState, action: TAppAction): ISearchPageState {
  switch (action.type) {
    case UserActionType.FIND_USERS_REQUEST:
      return {
        ...state,
        isFetching: true,
      };

    case UserActionType.FIND_USERS_RESPONSE_SUCCESS:
      return {
        ...state,
        didInvalidate: false,
        foundUsers: action.data.foundUsers.map((user) => user.id),
        isFetching: false,
        itemsPerPage: action.data.itemsPerPage,
        pageNum: action.requestActionData.pageNum,
        totalItemsCount: action.data.totalItemsCount,
      };

    case UserActionType.FIND_USERS_RESPONSE_ERROR:
      return {
        ...state,
        didInvalidate: false,
        isFetching: false,
      };

    case UserActionType.INVALIDATE_SEARCH_RESULTS:
      return {
        ...state,
        didInvalidate: true,
      };
  }

  return state;
}
