const initialState = {
  url: null,
  data: null,
  isFetching: false,
  error: null,
  history: []
};

const collection = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_COLLECTION_REQUEST":
      return Object.assign({}, state, {
        url: action.url,
        isFetching: true,
        error: null
      });

    case "FETCH_COLLECTION_FAILURE":
      return Object.assign({}, state, {
        isFetching: false,
        error: action.message
      });

    case "LOAD_COLLECTION":
      let newHistory;
      let oldHistory = state.history;
      let last = oldHistory.slice(-1)[0];
      if (last && last.url === action.url) {
        newHistory = oldHistory.slice(0, -1);
      } else {
        newHistory = oldHistory.slice(0);
        if (state.data) {
          let isFacetChange = (state.data.id === action.data.id);

          if (!isFacetChange) {
            newHistory.push({
              url: state.data.url,
              text: state.data.title,
              id: state.data.id
            });
          }
        }
      }

      return Object.assign({}, state, {
        data: action.data,
        url: action.url ? action.url : state.url,
        isFetching: false,
        error: null,
        history: newHistory
      });

    case "CLEAR_COLLECTION":
      return Object.assign({}, state, {
        data: null,
        url: null,
        error: null,
        history: state.history.slice(0, -1)
      });

    case "FETCH_PAGE_REQUEST":
      return Object.assign({}, state, {
        pageUrl: action.url,
        isFetchingPage: true,
        error: null
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
        }),
        isFetching: false
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