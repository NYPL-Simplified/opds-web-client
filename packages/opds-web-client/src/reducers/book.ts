import { BookData, FetchErrorData } from "../interfaces";
import ActionCreator from "../actions";

export interface BookState {
  url: string;
  data: BookData;
  isFetching: boolean;
  error: FetchErrorData;
}

const initialState: BookState = {
  url: null,
  data: null,
  isFetching: false,
  error: null
};

const book = (state: BookState = initialState, action): BookState => {
  switch (action.type) {
    case ActionCreator.FETCH_BOOK_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        error: null
      });

    case ActionCreator.FETCH_BOOK_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        error: action.error
      });

    case ActionCreator.LOAD_BOOK:
      return Object.assign({}, state, {
        data: action.data,
        url: action.url ? action.url : state.url,
        isFetching: false
      });

    case ActionCreator.CLEAR_BOOK:
      return Object.assign({}, state, {
        data: null,
        url: null,
        error: null
      });

    case ActionCreator.CLOSE_ERROR:
      return Object.assign({}, state, {
        error: null
      });

    case ActionCreator.FULFILL_BOOK_REQUEST:
    case ActionCreator.UPDATE_BOOK_REQUEST:
      return Object.assign({}, state, {
        isFetching: true
      });

    case ActionCreator.FULFILL_BOOK_SUCCESS:
    case ActionCreator.UPDATE_BOOK_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false
      });

    case ActionCreator.FULFILL_BOOK_FAILURE:
    case ActionCreator.UPDATE_BOOK_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        error: action.error
      });

    case ActionCreator.LOAD_UPDATE_BOOK_DATA:
      return Object.assign({}, state, {
        data: Object.assign({}, state.data, action.data)
      });

    default:
      return state;
  }
};

export default book;