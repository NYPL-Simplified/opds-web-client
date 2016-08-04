import { BookData, FetchErrorData } from "../interfaces";

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
    case "FETCH_BOOK_REQUEST":
      return Object.assign({}, state, {
        isFetching: true,
        error: null
      });

    case "FETCH_BOOK_FAILURE":
      return Object.assign({}, state, {
        isFetching: false,
        error: action.error
      });

    case "LOAD_BOOK":
      return Object.assign({}, state, {
        data: action.data,
        url: action.url ? action.url : state.url,
        isFetching: false
      });

    case "CLEAR_BOOK":
      return Object.assign({}, state, {
        data: null,
        url: null,
        error: null
      });

    case "CLOSE_ERROR":
      return Object.assign({}, state, {
        error: null
      });

    case "FULFILL_BOOK_REQUEST":
    case "BORROW_BOOK_REQUEST":
      return Object.assign({}, state, {
        isFetching: true
      });

    case "FULFILL_BOOK_SUCCESS":
    case "BORROW_BOOK_SUCCESS":
      return Object.assign({}, state, {
        isFetching: false
      });

    case "FULFILL_BOOK_FAILURE":
    case "BORROW_BOOK_FAILURE":
      return Object.assign({}, state, {
        isFetching: false,
        error: action.error
      });

    case "LOAD_BORROW_DATA":
      return Object.assign({}, state, {
        data: Object.assign({}, state.data, action.data)
      });

    default:
      return state;
  }
};

export default book;