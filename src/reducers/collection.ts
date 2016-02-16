const initialState = {
  url: null,
  data: null,
  isFetching: false,
  error: null
};

const collection = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_COLLECTION_REQUEST":
      return Object.assign({}, state, {
        url: action.url,
        isFetching: true
      });

    case "FETCH_COLLECTION_SUCCESS":
      return Object.assign({}, state, {
        isFetching: false
      });

    case "FETCH_COLLECTION_FAILURE":
      return Object.assign({}, state, {
        isFetching: false,
        error: action.message
      });

    case "LOAD_COLLECTION":
      return Object.assign({}, state, {
        data: action.data,
        url: action.url ? action.url : state.url
      });

    case "CLEAR_COLLECTION":
      return Object.assign({}, state, {
        data: null,
        url: null
      });

    case "FETCH_PAGE_REQUEST":
      return Object.assign({}, state, {
        pageUrl: action.url,
        isFetchingPage: true
      });

    case "FETCH_PAGE_SUCCESS":
      return Object.assign({}, state, {
        isFetchingPage: false
      });

    case "FETCH_PAGE_FAILURE":
      return Object.assign({}, state, {
        isFetchingPage: false,
        error: action.message
      });

    case "LOAD_PAGE":
      return Object.assign({}, state, {
        data: Object.assign({}, state.data, {
          books: Object.assign([], state.data.books).concat(action.data.books),
          nextPageUrl: action.data.nextPageUrl
        })
      });

    case "LOAD_SEARCH_DESCRIPTION":
      return Object.assign({}, state, {
        data: Object.assign({}, state.data, {
          search: action.data
        })
      });

    case "CLOSE_ERROR":
      return Object.assign({}, state, {
        error: null
      });

    default:
      return state;
  }
};

export default collection;