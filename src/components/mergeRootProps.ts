export function findBookInCollection(collection: CollectionData, bookUrl: string) {
  let allBooks = collection.lanes.reduce((books, lane) => {
    return books.concat(lane.books);
  }, collection.books);

  return allBooks.find(book => book.url === bookUrl);
}

// define setCollection and setBook here so that they can call onNavigate from component props
export default (stateProps, dispatchProps, componentProps) => {
  let setCollection = (url: string, skipOnNavigate: boolean = false) => {
    return new Promise((resolve, reject) => {
      if (!url) {
        dispatchProps.clearCollection();
        resolve(null);
      } else if (url === stateProps.collectionUrl) {
        resolve(stateProps.collectionData);
      } else {
        // only fetch collection if url has changed
        dispatchProps.fetchCollection(url).then(data => resolve(data));
      }

      if (!skipOnNavigate && componentProps.onNavigate) {
        componentProps.onNavigate(url, stateProps.bookUrl);
      }
    });
  };

  let setBook = (book: BookData|string, skipOnNavigate: boolean = false) => {
    return new Promise((resolve, reject) => {
      // TODO: don't fetch a book if it's already there???
      let url = null;
      let bookData = null;

      if (typeof book === "string") {
        url = book;
      } else if (!book) {
      } else if (typeof book === "object") {
        bookData = book;
        url = book.url;
      }

      if (!url && !bookData) {
        dispatchProps.clearBook();
        resolve(null);
      } else if (bookData) {
        dispatchProps.loadBook(bookData, url);
        resolve(bookData);
      } else if (url === stateProps.bookUrl) {
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

      if (!skipOnNavigate && componentProps.onNavigate) {
        componentProps.onNavigate(stateProps.collectionUrl, url);
      }
    });
  };

  return Object.assign({}, componentProps, stateProps, dispatchProps, {
    setCollection: setCollection,
    setBook: setBook,
    setCollectionAndBook: (collectionUrl: string, book: BookData|string, skipOnNavigate: boolean = false) => {
      return new Promise((resolve, reject) => {
        // skip onNavigate for both fetches, but call it at the end
        // either collectionUrl or bookUrl can be null
        setCollection(collectionUrl, true).then(collectionData => {
          setBook(book, true).then(bookData => {
            resolve({ collectionData, bookData });
            if (!skipOnNavigate && componentProps.onNavigate) {
              let bookUrl = (typeof book === "string" ? book : (book ? book.url : null));
              componentProps.onNavigate(collectionUrl, bookUrl);
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