const initialState = {
  url: null,
  data: null,
  isFetching: false,
  error: null
};

const book = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_BOOK_REQUEST":
      return Object.assign({}, state, {
        url: action.url,
        isFetching: true,
        error: null
      });

    case "FETCH_BOOK_SUCCESS":
      return Object.assign({}, state, {
        isFetching: false
      });

    case "FETCH_BOOK_FAILURE":
      return Object.assign({}, state, {
        isFetching: false,
        error: action.message
      });

    case "LOAD_BOOK":
      return Object.assign({}, state, {
        data: action.data,
        url: action.url ? action.url : state.url
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