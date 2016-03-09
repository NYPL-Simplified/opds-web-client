import * as React from "react";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps, mergeRootProps } from "./mergeRootProps";
import Modal from "./Modal";
import BookDetails from "./BookDetails";
import LoadingIndicator from "./LoadingIndicator";
import ErrorMessage from "./ErrorMessage";
import Collection from "./Collection";
import UrlForm from "./UrlForm";
import SkipNavigationLink from "./SkipNavigationLink";
import { visuallyHiddenStyle } from "./styles";

export class Root extends React.Component<RootProps, any> {
  render(): JSX.Element {
    let BookDetailsContainer = this.props.BookDetailsContainer;

    return (
      <div className="browser">
        <SkipNavigationLink />

        { this.props.isFetching && <LoadingIndicator /> }
        { this.props.error &&
          <ErrorMessage
            message={this.props.error}
            retry={() => this.props.setCollection(this.props.collectionUrl)} />
        }
        { this.props.bookData &&
            <Modal close={this.props.clearBook}>
              { BookDetailsContainer ?
                <BookDetailsContainer book={this.props.bookData}>
                  <BookDetails book={this.props.bookData} />
                </BookDetailsContainer> :
                <BookDetails book={this.props.bookData} />
              }
            </Modal>
        }

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
            pathFor={this.props.pathFor}
            history={this.props.history} /> :
          this.props.isFetching ? null : <UrlForm setCollection={this.props.setCollection} url={this.props.collectionUrl} />
        }
      </div>
    );
  }

  componentWillMount() {
    if (this.props.collection || this.props.book) {
      this.props.setCollectionAndBook(this.props.collection, this.props.book, true);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.collection !== this.props.collection || nextProps.book !== this.props.book) {
      this.props.setCollectionAndBook(nextProps.collection, nextProps.book, true);
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