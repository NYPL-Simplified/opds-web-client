import { CollectionData, LinkData, FetchErrorData } from "../interfaces";
import history from "./history";
import ActionCreator from "../actions";

export interface CollectionState {
  url: string | null;
  data?: CollectionData | null;
  isFetching?: boolean;
  isFetchingPage: boolean;
  error?: FetchErrorData | null;
  history: LinkData[];
  pageUrl?: string;
}

export const initialState: CollectionState = {
  url: null,
  data: null,
  isFetching: false,
  isFetchingPage: false,
  error: null,
  history: []
};

const collection = (state = initialState, action): CollectionState => {
  switch (action.type) {
    case ActionCreator.COLLECTION_REQUEST:
      return {
        ...state,
        isFetching: true,
        error: null
      };

    case ActionCreator.COLLECTION_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.error
      };

    case ActionCreator.COLLECTION_LOAD:
      return {
        ...state,
        data: action.data,
        url: action.url ? action.url : state.url,
        isFetching: false,
        error: null,
        history: history(state, action)
      };

    case ActionCreator.COLLECTION_CLEAR:
      return {
        ...state,
        data: null,
        url: null,
        error: null,
        history: state.history.slice(0, -1)
      };

    case ActionCreator.PAGE_REQUEST:
      return {
        ...state,
        pageUrl: action.url,
        isFetchingPage: true,
        error: null
      };

    case ActionCreator.PAGE_FAILURE:
      return {
        ...state,
        isFetchingPage: false,
        error: action.error
      };

    case ActionCreator.PAGE_LOAD:
      return {
        ...state,
        data: Object.assign({}, state.data, {
          // the following optional chaining will evaluate to [] if
          // state.data.books is null or undefined
          books: [...(state.data?.books ?? [])].concat(action.data.books),
          nextPageUrl: action.data.nextPageUrl
        }),
        isFetchingPage: false
      };

    case ActionCreator.SEARCH_DESCRIPTION_LOAD:
      return {
        ...state,
        data: Object.assign({}, state.data, {
          search: action.data
        })
      };

    case ActionCreator.CLOSE_ERROR:
      return { ...state, error: null };

    default:
      return state;
  }
};

export default collection;
