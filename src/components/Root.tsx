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
import mergeRootProps from "./mergeRootProps";
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
        { this.props.error &&
          <ErrorMessage
            message={this.props.error}
            retry={() => this.props.setCollection(this.props.collectionUrl)} />
        }
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

let connectOptions = { withRef: true, pure: true };
const ConnectedRoot = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeRootProps,
  connectOptions
)(Root);

export default ConnectedRoot;