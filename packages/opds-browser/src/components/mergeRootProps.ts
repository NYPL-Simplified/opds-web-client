import ActionsCreator from "../actions";
import DataFetcher from "../DataFetcher";
import { adapter } from "../OPDSDataAdapter";

export function findBookInCollection(collection: CollectionData, book: string) {
  if (collection) {
    let allBooks = collection.lanes.reduce((books, lane) => {
      return books.concat(lane.books);
    }, collection.books);

    return allBooks.find(b => b.url === book || b.id === book);
  } else {
    return null;
  }
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
    loadedCollectionUrl: state.browser.collection.url
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

export function mergeRootProps(stateProps, createDispatchProps, componentProps) {
  let fetcher = new DataFetcher(componentProps.proxyUrl, adapter);
  let dispatchProps = createDispatchProps.createDispatchProps(fetcher);

  let setCollection = (url: string, isTopLevel: boolean = false) => {
    return new Promise((resolve, reject) => {
      if (url === stateProps.loadedCollectionUrl) {
        // if url is same, do nothing unless there's currently error
        if (stateProps.error) {
          dispatchProps.fetchCollection(url, isTopLevel).then(data => resolve(data));
        } else {
          resolve(stateProps.collectionData);
        }
      } else {
        // if url is changed, either fetch or clear collection
        if (url) {
          dispatchProps.fetchCollection(url, isTopLevel).then(data => resolve(data));
        } else {
          dispatchProps.clearCollection();
          resolve(null);
        }
      }
    });
  };

  let setBook = (book: BookData|string, collectionData: CollectionData = null) => {
    return new Promise((resolve, reject) => {
      let url = null;
      let bookData = null;

      if (typeof book === "string") {
        url = book;
        bookData = findBookInCollection(collectionData, url);
      } else if (book && typeof book === "object") {
        url = book.url;
        bookData = book;
      }

      if (bookData) {
        dispatchProps.loadBook(bookData, url);
        resolve(bookData);
      } else if (url) {
        dispatchProps.fetchBook(url).then(data => resolve(data));
      } else {
        dispatchProps.clearBook();
        resolve(null);
      }
    });
  };

  let refreshBook = () => {
    return dispatchProps.fetchBook(stateProps.bookUrl);
  };

  return Object.assign({}, componentProps, stateProps, dispatchProps, {
    setCollection: setCollection,
    setBook: setBook,
    setCollectionAndBook: (collectionUrl: string, book: string, isTopLevel: boolean = false) => {
      return new Promise((resolve, reject) => {
        setCollection(collectionUrl, isTopLevel).then((collectionData: CollectionData) => {
          setBook(book, collectionData).then((bookData: BookData) => {
            resolve({ collectionData, bookData });
          }).catch(err => reject(err));
        }).catch(err => reject(err));
      });
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