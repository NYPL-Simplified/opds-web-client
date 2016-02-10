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