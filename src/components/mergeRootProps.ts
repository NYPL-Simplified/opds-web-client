import {
  fetchCollection,
  fetchPage,
  fetchBook,
  loadBook,
  clearCollection,
  clearBook,
  fetchSearchDescription,
  closeError
} from "../actions";
import DataFetcher from "../DataFetcher";

export function findBookInCollection(collection: CollectionData, bookUrl: string) {
  let allBooks = collection.lanes.reduce((books, lane) => {
    return books.concat(lane.books);
  }, collection.books);

  return allBooks.find(book => book.url === bookUrl);
}

export function mapStateToProps(state) {
  return {
    collectionData: state.collection.data,
    collectionUrl: state.collection.url,
    isFetching: (state.collection.isFetching || state.book.isFetching),
    isFetchingPage: state.collection.isFetchingPage,
    error: (state.collection.error || state.book.error),
    bookData: state.book.data,
    bookUrl: state.book.url
  };
};

export function mapDispatchToProps(dispatch) {
  return {
    fetchCollection: (url: string, fetcher: DataFetcher) => dispatch(fetchCollection(url, fetcher)),
    fetchPage: (url: string, fetcher: DataFetcher) => dispatch(fetchPage(url, fetcher)),
    fetchBook: (url: string, fetcher: DataFetcher) => dispatch(fetchBook(url, fetcher)),
    loadBook: (book: BookData, url: string) => dispatch(loadBook(book, url)),
    clearCollection: () => dispatch(clearCollection()),
    clearBook: () => dispatch(clearBook()),
    fetchSearchDescription: (url: string, fetcher: DataFetcher) => dispatch(fetchSearchDescription(url, fetcher)),
    closeError: () => dispatch(closeError())
  };
};

// define setCollection and setBook here so that they can call onNavigate from component props
export function mergeRootProps(stateProps, dispatchProps, componentProps) {
  // wrap componentProps.onNavigate so it only fires when collection or book url changes
  let onNavigate = componentProps.onNavigate ? (collectionUrl: string, bookUrl: string): void => {
    if (collectionUrl !== stateProps.collectionUrl || bookUrl !== stateProps.bookUrl) {
      componentProps.onNavigate(collectionUrl, bookUrl);
    }
  } : undefined;

  let fetcher = new DataFetcher(componentProps.proxyUrl);

  let setCollection = (url: string, skipOnNavigate: boolean = false) => {
    return new Promise((resolve, reject) => {
      if (!url) {
        dispatchProps.clearCollection();
        resolve(null);
      } else if (!stateProps.error && url === stateProps.collectionUrl) {
        resolve(stateProps.collectionData);
      } else {
        // only fetch collection if url has changed
        dispatchProps.fetchCollection(url, fetcher).then(data => resolve(data));
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
      } else if (!stateProps.error && url === stateProps.bookUrl) {
        resolve(stateProps.bookData);
      } else {
        if (stateProps.collectionData) {
          bookData = findBookInCollection(stateProps.collectionData, url);
        }

        if (bookData) {
          dispatchProps.loadBook(bookData, url);
          resolve(bookData);
        } else {
          dispatchProps.fetchBook(url, fetcher).then(data => resolve(data));
        }
      }

      if (!skipOnNavigate && onNavigate) {
        onNavigate(stateProps.collectionUrl, url);
      }
    });
  };

  let fetchPage = (url: string) => {
    return dispatchProps.fetchPage(url, fetcher);
  };

  let fetchSearchDescription = (url: string) => {
    return dispatchProps.fetchSearchDescription(url, fetcher);
  };

  return Object.assign({}, componentProps, stateProps, dispatchProps, {
    setCollection: setCollection,
    setBook: setBook,
    fetchPage: fetchPage,
    fetchSearchDescription: fetchSearchDescription,
    setCollectionAndBook: (collectionUrl: string, book: BookData|string, skipOnNavigate: boolean = false) => {
      return new Promise((resolve, reject) => {
        // skip onNavigate for both fetches, but call it at the end
        // either collectionUrl or bookUrl can be null
        setCollection(collectionUrl, true).then(collectionData => {
          setBook(book, true).then(bookData => {
            resolve({ collectionData, bookData });

            if (!skipOnNavigate && onNavigate) {
              let bookUrl = (typeof book === "string" ? book : (book ? book.url : null));
              onNavigate(collectionUrl, bookUrl);
            }
          }).catch(err => reject(err));
        }).catch(err => reject(err));
      });
    },
    clearCollection: () => {
      setCollection(null);
    },
    clearBook: () => {
      setBook(null);
    },
    // so that collectionData can be passed to Root as prop and not be overwritten by empty initial state
    collectionData: componentProps.collectionData ? componentProps.collectionData : stateProps.collectionData
  });
};