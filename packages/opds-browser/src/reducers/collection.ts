export const initialState = {
  url: null,
  data: null,
  isFetching: false,
  isFetchingPage: false,
  error: null,
  history: []
};

const collection = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_COLLECTION_REQUEST":
      return Object.assign({}, state, {
        isFetching: true,
        error: null
      });

    case "FETCH_COLLECTION_FAILURE":
      return Object.assign({}, state, {
        isFetching: false,
        error: action.error
      });

    case "LOAD_COLLECTION":
      let newHistory;
      let oldHistory = state.history;

      if (action.isTopLevel) {
        if (action.url === action.data.catalogRootUrl) {
          newHistory = [];
        } else {
          newHistory = [{
            text: "Catalog",
            url: action.data.catalogRootUrl,
            id: null
          }];
        }
      } else {
        if ((state.data && state.data.catalogRootUrl && state.data.catalogRootUrl === action.url) ||
            (action.data.catalogRootUrl && action.data.catalogRootUrl === action.url)) {
          newHistory = [];
        } else {
          let newUrlIndex = oldHistory.findIndex((link) => {
            return link.url === action.url;
          });
          if (newUrlIndex !== -1) {
            newHistory = oldHistory.slice(0, newUrlIndex);
          } else {
            newHistory = oldHistory.slice(0);
            if (state.data) {
              let isSameFeed = (state.data.id === action.data.id);
              let isSameTitle = (state.data.title === action.data.title);

              if (!isSameFeed && !isSameTitle) {
                newHistory.push({
                  url: state.data.url,
                  text: state.data.title,
                  id: state.data.id
                });
              }
            }
          }

          if (action.data.catalogRootUrl) {
            let catalogRootUrlInHistory = newHistory.find((link) => {
              return link.url === action.data.catalogRootUrl;
            });

            if (!catalogRootUrlInHistory) {
              newHistory = [{
                text: "Catalog",
                url: action.data.catalogRootUrl,
                id: null
              }];
            }
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
        error: action.error
      });

    case "LOAD_PAGE":
      return Object.assign({}, state, {
        data: Object.assign({}, state.data, {
          books: Object.assign([], state.data.books).concat(action.data.books),
          nextPageUrl: action.data.nextPageUrl
        }),
        isFetchingPage: false
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