const initialState = {
  url: null,
  data: null,
  isFetching: false
};

const collection = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_COLLECTION_REQUEST":
      return Object.assign({}, state, {
        url: action.url,
        isFetching: true
      });

    case "FETCH_COLLECTION_FAILURE":
    case "FETCH_COLLECTION_SUCCESS":
      return Object.assign({}, state, {
        isFetching: false
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

    default:
      return state;
  }
}

export default collection;