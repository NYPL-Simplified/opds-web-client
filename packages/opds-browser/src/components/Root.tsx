import * as React from "react";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps, mergeRootProps } from "./mergeRootProps";
import BookDetails from "./BookDetails";
import LoadingIndicator from "./LoadingIndicator";
import ErrorMessage from "./ErrorMessage";
import Collection from "./Collection";
import UrlForm from "./UrlForm";
import SkipNavigationLink from "./SkipNavigationLink";
import { visuallyHiddenStyle } from "./styles";

export class Root extends React.Component<RootProps, any> {
  render(): JSX.Element {
    return (
      <div className="browser">
        <SkipNavigationLink />

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
            setBook={this.props.setBook}
            history={this.props.history} /> :
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

let connectOptions = { withRef: true, pure: true };
const ConnectedRoot = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeRootProps,
  connectOptions
)(Root);

export default ConnectedRoot;