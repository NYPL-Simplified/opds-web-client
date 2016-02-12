import * as React from "react";
import { connect } from "react-redux";
import {
  fetchCollection,
  fetchPage,
  clearCollection,
  fetchSearchDescription,
  closeError,
  showBookDetails,
  hideBookDetails
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
        { this.props.book && <BookDetails {...this.props.book} hideBookDetails={this.props.hideBookDetails} /> }
        { this.props.isFetching && <LoadingIndicator /> }
        { this.props.error && <ErrorMessage message={this.props.error} closeError={this.props.closeError} /> }

        { this.props.collectionData ?
          <Collection
            {...this.props.collectionData}
            fetchCollection={this.props.fetchCollection}
            fetchPage={this.props.fetchPage}
            isFetching={this.props.isFetching}
            isFetchingPage={this.props.isFetchingPage}
            error={this.props.error}
            fetchSearchDescription={this.props.fetchSearchDescription}
            showBookDetails={this.props.showBookDetails} /> :
          this.props.isFetching ? null : <UrlForm fetchCollection={this.props.fetchCollection} url={this.props.collectionUrl} />
        }
      </div>
    );
  }

  componentWillMount() {
    if (this.props.startCollection) {
      // skip onNavigate, which is not meant for initial fetch
      if (this.props.startBook) {
        this.props.fetchCollection(this.props.startCollection, true, this.props.startBook);
      } else {
        this.props.fetchCollection(this.props.startCollection, true);
      }
    }
  }
}

const mapStateToProps = (state) => {
  return {
    collectionData: state.collection.data,
    collectionUrl: state.collection.url,
    isFetching: state.collection.isFetching,
    isFetchingPage: state.collection.isFetchingPage,
    error: state.collection.error,
    book: state.book
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchCollection: (url: string, bookUrl?: string) => dispatch(fetchCollection(url, bookUrl)),
    fetchPage: (url: string) => dispatch(fetchPage(url)),
    clearCollection: () => dispatch(clearCollection()),
    fetchSearchDescription: (url: string) => dispatch(fetchSearchDescription(url)),
    closeError: () => dispatch(closeError()),
    showBookDetails: (book: BookProps) => dispatch(showBookDetails(book)),
    hideBookDetails: () => dispatch(hideBookDetails())
  };
};

// define new fetchCollection here so that it can call onFetch from component props
const mergeProps = (stateProps, dispatchProps, componentProps) => {
  return Object.assign({}, componentProps, stateProps, dispatchProps, {
    fetchCollection: (url: string, skipOnNavigate: boolean = false, bookUrl?: string) => {
      dispatchProps.fetchCollection(url, bookUrl);

      if (!skipOnNavigate && componentProps.onNavigate) {
        componentProps.onNavigate(url, bookUrl);
      }
    },

    showBookDetails: (book: BookProps) => {
      dispatchProps.showBookDetails(book);

      if (componentProps.onNavigate) {
        componentProps.onNavigate(stateProps.collectionUrl, book.url);
      }
    },

    hideBookDetails: (book: BookProps) => {
      dispatchProps.hideBookDetails(book);

      if (componentProps.onNavigate) {
        componentProps.onNavigate(stateProps.collectionUrl, book.url);
      }
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