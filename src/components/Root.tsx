import * as React from "react";
import { connect } from "react-redux";
import {
  fetchCollection,
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
            fetchSearchDescription={this.props.fetchSearchDescription}
            showBookDetails={this.props.showBookDetails} /> :
          this.props.isFetching ? null : <UrlForm fetchCollection={this.props.fetchCollection} url={this.props.collectionUrl} />
        }
      </div>
    );
  }

  componentWillMount() {
    if (this.props.startUrl) {
      // skip onFetch, which is not meant for initial fetch
      this.props.fetchCollection(this.props.startUrl, true);
    }
  }
}

const mapStateToProps = (state) => {
  console.log(state.book);
  return {
    collectionData: state.collection.data,
    collectionUrl: state.collection.url,
    isFetching: state.collection.isFetching,
    error: state.collection.error,
    book: state.book
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchCollection: (url: string) => dispatch(fetchCollection(url)),
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
    fetchCollection: (url: string, skipOnFetch: boolean = false) => {
      dispatchProps.fetchCollection(url);

      if (!skipOnFetch && componentProps.onFetch) {
        componentProps.onFetch(url);
      }
    }
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