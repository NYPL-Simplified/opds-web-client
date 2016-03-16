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
    collectionData: state.collection.data || ownProps.collectionData,
    collectionUrl: state.collection.url,
    isFetching: (state.collection.isFetching || state.book.isFetching),
    isFetchingPage: state.collection.isFetchingPage,
    error: (state.collection.error || state.book.error),
    bookData: state.book.data || ownProps.bookData,
    bookUrl: state.book.url,
    history: state.collection.history
  };
};

export function mapDispatchToProps(dispatch) {
  return {
    createDispatchProps: (fetcher) => {
      let actions = new ActionsCreator(fetcher);
      return {
        fetchCollection: (url: string) => dispatch(actions.fetchCollection(url)),
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
  // wrap componentProps.onNavigate so it only fires when collection or book url changes
  let onNavigate = componentProps.onNavigate ? (collectionUrl: string, bookUrl: string): void => {
    if (collectionUrl !== stateProps.collectionUrl || bookUrl !== stateProps.bookUrl) {
      componentProps.onNavigate(collectionUrl, bookUrl);
    }
  } : undefined;

  let pathFor = componentProps.pathFor ? componentProps.pathFor : (collectionUrl: string, bookUrl: string) => { return "#"; };

  let fetcher = new DataFetcher(componentProps.proxyUrl, adapter);
  let dispatchProps = createDispatchProps.createDispatchProps(fetcher);

  let setCollection = (url: string, skipOnNavigate: boolean = false) => {
    return new Promise((resolve, reject) => {
      if (!url) {
        dispatchProps.clearCollection();
        resolve(null);
      } else if (!stateProps.error && stateProps.collectionData && url === stateProps.collectionUrl) {
        resolve(stateProps.collectionData);
      } else {
        // only fetch collection if url has changed
        dispatchProps.fetchCollection(url).then(data => resolve(data));
      }

      if (!skipOnNavigate && onNavigate) {
        onNavigate(url, stateProps.bookUrl);
      }
    });
  };

  let setBook = (book: BookData|string, skipOnNavigate: boolean = false) => {
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
      } else if (!stateProps.error && stateProps.bookData && url === stateProps.bookUrl) {
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

      if (!skipOnNavigate && onNavigate) {
        onNavigate(stateProps.collectionUrl, url);
      }
    });
  };

  let refreshBook = () => {
    return dispatchProps.fetchBook(stateProps.bookUrl);
  };

  return Object.assign({}, componentProps, stateProps, dispatchProps, {
    setCollection: setCollection,
    setBook: setBook,
    refreshBook: refreshBook,
    setCollectionAndBook: (collectionUrl: string, book: BookData|string, skipOnNavigate: boolean = false) => {
      return new Promise((resolve, reject) => {
        // skip onNavigate for both fetches, but call it at the end
        // either collectionUrl or bookUrl can be null
        setCollection(collectionUrl, true).then(collectionData => {
          setBook(book, true).then(bookData => {
            resolve({ collectionData, bookData });
          }).catch(err => reject(err));
        }).catch(err => reject(err));

        if (!skipOnNavigate && onNavigate) {
          let bookUrl = (typeof book === "string" ? book : (book ? book.url : null));
          onNavigate(collectionUrl, bookUrl);
        }
      });
    },
    clearCollection: () => {
      setCollection(null);
    },
    clearBook: () => {
      setBook(null);
    },
    pathFor: pathFor
  });
};