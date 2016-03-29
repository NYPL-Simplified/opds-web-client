import ActionsCreator from "../actions";
import DataFetcher from "../DataFetcher";
import { adapter } from "../OPDSDataAdapter";

export function findBookInCollection(collection: CollectionData, bookUrl: string) {
  let allBooks = collection.lanes.reduce((books, lane) => {
    return books.concat(lane.books);
  }, collection.books);

  return allBooks.find(book => book.url === bookUrl);
}

export function mapStateToProps(state, ownProps) {
  return {
    collectionData: state.browser.collection.data || ownProps.collectionData,
    isFetching: (state.browser.collection.isFetching || state.browser.book.isFetching),
    isFetchingPage: state.browser.collection.isFetchingPage,
    error: (state.browser.collection.error || state.browser.book.error),
    bookData: state.browser.book.data || ownProps.bookData,
    history: state.browser.collection.history,
    pathFor: ownProps.pathFor || ((collectionUrl: string, bookUrl: string) => "#"),
    currentCollectionUrl: state.browser.collection.url,
    currentBookUrl: state.browser.book.url
  };
};

export function mapDispatchToProps(dispatch) {
  return {
    createDispatchProps: (fetcher) => {
      let actions = new ActionsCreator(fetcher);
      return {
        fetchCollection: (url: string, isTopLevel) => dispatch(actions.fetchCollection(url, isTopLevel)),
        fetchPage: (url: string) => dispatch(actions.fetchPage(url)),
        fetchBook: (url: string) => dispatch(actions.fetchBook(url)),
        loadBook: (book: BookData, url: string) => dispatch(actions.loadBook(book, url)),
        clearCollection: () => dispatch(actions.clearCollection()),
        clearBook: () => dispatch(actions.clearBook()),
        fetchSearchDescription: (url: string) => dispatch(actions.fetchSearchDescription(url)),
        closeError: () => dispatch(actions.closeError())
      };
    }
  };
};

// define setCollection and setBook here so that they can call onNavigate from component props
export function mergeRootProps(stateProps, createDispatchProps, componentProps) {
  let fetcher = new DataFetcher(componentProps.proxyUrl, adapter);
  let dispatchProps = createDispatchProps.createDispatchProps(fetcher);

  let setCollection = (url: string, isTopLevel: boolean = false) => {
    return new Promise((resolve, reject) => {
      if (!url) {
        dispatchProps.clearCollection();
        resolve(null);
      } else if (!stateProps.error && stateProps.collectionData && url === stateProps.currentCollectionUrl) {
        resolve(stateProps.collectionData);
      } else {
        // only fetch collection if url has changed
        dispatchProps.fetchCollection(url, isTopLevel).then(data => resolve(data));
      }
    });
  };

  let setBook = (book: BookData|string) => {
    return new Promise((resolve, reject) => {
      let url = null;
      let bookData = null;

      if (typeof book === "string") {
        url = book;
      } else if (book && typeof book === "object") {
        bookData = book;

        if (book.url) {
          url = book.url;
        }
      }

      if (!url && !bookData) {
        dispatchProps.clearBook();
        resolve(null);
      } else if (bookData) {
        dispatchProps.loadBook(bookData, url);
        resolve(bookData);
      } else if (!stateProps.error && stateProps.bookData && url === stateProps.currentBookUrl) {
        resolve(stateProps.bookData);
      } else {
        if (stateProps.collectionData) {
          bookData = findBookInCollection(stateProps.collectionData, url);
        }

        if (bookData) {
          dispatchProps.loadBook(bookData, url);
          resolve(bookData);
        } else {
          dispatchProps.fetchBook(url).then(data => resolve(data));
        }
      }
    });
  };

  let refreshBook = () => {
    return dispatchProps.fetchBook(stateProps.bookUrl);
  };

  return Object.assign({}, componentProps, stateProps, dispatchProps, {
    setCollection: setCollection,
    setBook: setBook,
    setCollectionAndBook: (collectionUrl: string, bookUrl: string, isTopLevel: boolean = false) => {
      componentProps.onNavigate(collectionUrl, bookUrl, isTopLevel);
    },
    refreshBook: refreshBook,
    clearCollection: () => {
      setCollection(null);
    },
    clearBook: () => {
      setBook(null);
    }
  });
};