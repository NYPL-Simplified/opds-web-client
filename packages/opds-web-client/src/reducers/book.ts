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

    default:
      return state;
  }
};

export default book;