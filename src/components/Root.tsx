import * as React from "react";
import { connect } from "react-redux";
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
import BookDetails from "./BookDetails";
import LoadingIndicator from "./LoadingIndicator";
import ErrorMessage from "./ErrorMessage";
import Collection from "./Collection";
import UrlForm from "./UrlForm";

export class Root extends React.Component<RootProps, any> {
  render(): JSX.Element {
    return (
      <div className="browser">
        { this.props.isFetching && <LoadingIndicator /> }
        { this.props.error && <ErrorMessage message={this.props.error} closeError={this.props.closeError} /> }
        { this.props.bookData && <BookDetails book={this.props.bookData} clearBook={this.props.clearBook} /> }

        { this.props.collectionData ?
          <Collection
            collection={this.props.collectionData}
            setCollection={this.props.setCollection}
            fetchPage={this.props.fetchPage}
            isFetching={this.props.isFetching}
            isFetchingPage={this.props.isFetchingPage}
            error={this.props.error}
            fetchSearchDescription={this.props.fetchSearchDescription}
            setBook={this.props.setBook} /> :
          this.props.isFetching ? null : <UrlForm setCollection={this.props.setCollection} url={this.props.collectionUrl} />
        }
      </div>
    );
  }

  componentWillMount() {
    if (this.props.startCollection || this.props.startBook) {
      this.props.setCollectionAndBook(this.props.startCollection, this.props.startBook, true);
    }
  }
}

function findBookInCollection(collection: CollectionData, bookUrl: string) {
  let allBooks = collection.lanes.reduce((books, lane) => {
    return books.concat(lane.books);
  }, collection.books);

  return allBooks.find(book => book.url === bookUrl);
}

const mapStateToProps = (state) => {
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

const mapDispatchToProps = (dispatch) => {
  return {
    fetchCollection: (url: string) => dispatch(fetchCollection(url)),
    fetchPage: (url: string) => dispatch(fetchPage(url)),
    fetchBook: (url: string) => dispatch(fetchBook(url)),
    loadBook: (book: BookData, url: string) => dispatch(loadBook(book, url)),
    clearCollection: () => dispatch(clearCollection()),
    clearBook: () => dispatch(clearBook()),
    fetchSearchDescription: (url: string) => dispatch(fetchSearchDescription(url)),
    closeError: () => dispatch(closeError())
  };
};

// define setCollection and setBook here so that they can call onNavigate from component props
const mergeProps = (stateProps, dispatchProps, componentProps) => {
  let setCollection = (url: string, skipOnNavigate: boolean = false) => {
    return new Promise((resolve, reject) => {
      if (!url) {
        dispatchProps.clearCollection();
        resolve();
      } else if (url === stateProps.collectionUrl) {
        resolve();
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
      let url;

      if (typeof book === "string") {
        url = book;
        book = null;
      } else if (!book) {
      } else if (typeof book === "object") {
        url = book.url;
      }

      if (!url) {
        dispatchProps.clearBook();
        resolve();
      } else if (url === stateProps.bookUrl) {
        resolve();
      } else {
        if (stateProps.collectionData) {
          book = findBookInCollection(stateProps.collectionData, url);
        }

        if (book) {
          dispatchProps.loadBook(book, url);
          resolve(book);
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
      // skip onNavigate for both fetches, but call it at the end
      // either collectionUrl or bookUrl can be null
      setCollection(collectionUrl, true).then(data => {
        setBook(book, true).then(data => {
          if (!skipOnNavigate && componentProps.onNavigate) {
            let bookUrl = (typeof book === "string" ? book : (book ? book.url : null));
            componentProps.onNavigate(collectionUrl, bookUrl);
          }
        });
      });
    },
    clearCollection: () => {
      setCollection(null);
    },
    clearBook: () => {
      setBook(null);
    },

    collectionData: componentProps.collectionData ? componentProps.collectionData : stateProps.collectionData
  });
};

let connectOptions = { withRef: true, pure: true };
const ConnectedRoot = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
  connectOptions
)(Root);

export default ConnectedRoot;