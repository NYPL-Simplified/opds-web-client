import { CollectionData, LinkData, FetchErrorData } from "../interfaces";
import history from "./history";
import ActionCreator from "../actions";

export interface CollectionState {
  url: string;
  data: CollectionData;
  isFetching: boolean;
  isFetchingPage: boolean;
  error: FetchErrorData;
  history: LinkData[];
}

const initialState: CollectionState = {
  url: null,
  data: null,
  isFetching: false,
  isFetchingPage: false,
  error: null,
  history: []
};

const collection = (state = initialState, action) => {
  switch (action.type) {
    case ActionCreator.FETCH_COLLECTION_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        error: null
      });

    case ActionCreator.FETCH_COLLECTION_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        error: action.error
      });

    case ActionCreator.LOAD_COLLECTION:
      return Object.assign({}, state, {
        data: action.data,
        url: action.url ? action.url : state.url,
        isFetching: false,
        error: null,
        history: history(state, action)
      });

    case ActionCreator.CLEAR_COLLECTION:
      return Object.assign({}, state, {
        data: null,
        url: null,
        error: null,
        history: state.history.slice(0, -1)
      });

    case ActionCreator.FETCH_PAGE_REQUEST:
      return Object.assign({}, state, {
        pageUrl: action.url,
        isFetchingPage: true,
        error: null
      });

    case ActionCreator.FETCH_PAGE_FAILURE:
      return Object.assign({}, state, {
        isFetchingPage: false,
        error: action.error
      });

    case ActionCreator.LOAD_PAGE:
      return Object.assign({}, state, {
        data: Object.assign({}, state.data, {
          books: Object.assign([], state.data.books).concat(action.data.books),
          nextPageUrl: action.data.nextPageUrl
        }),
        isFetchingPage: false
      });

    case ActionCreator.LOAD_SEARCH_DESCRIPTION:
      return Object.assign({}, state, {
        data: Object.assign({}, state.data, {
          search: action.data
        })
      });

    case ActionCreator.CLOSE_ERROR:
      return Object.assign({}, state, {
        error: null
      });

    default:
      return state;
  }
};

export default collection;