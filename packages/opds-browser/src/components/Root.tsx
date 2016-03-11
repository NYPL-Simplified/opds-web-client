import * as React from "react";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps, mergeRootProps } from "./mergeRootProps";
import Modal from "./Modal";
import BookDetails from "./BookDetails";
import LoadingIndicator from "./LoadingIndicator";
import ErrorMessage from "./ErrorMessage";
import Search from "./Search";
import Breadcrumbs from "./Breadcrumbs";
import Collection from "./Collection";
import UrlForm from "./UrlForm";
import SkipNavigationLink from "./SkipNavigationLink";
import { visuallyHiddenStyle } from "./styles";

export class Root extends React.Component<RootProps, any> {
  render(): JSX.Element {
    let BookDetailsContainer = this.props.BookDetailsContainer;

    let headerTitle = this.props.headerTitle || (this.props.collectionData ? this.props.collectionData.title : null);

    let showCollection = this.props.collectionData;
    let showBook = this.props.bookData;
    let showBookWrapper = this.props.bookUrl || this.props.bookData;
    let showUrlForm = !this.props.collectionData && !this.props.bookData && !this.props.isFetching;
    let showHeader = headerTitle;
    let showBreadcrumbs = showCollection && (this.props.bookData || this.props.history && this.props.history.length > 0);

    let padding = 10;
    let headerHeight = 40 + padding * 2;
    let navHeight = showBreadcrumbs ? 30 : 0;
    let marginTop = headerHeight + navHeight;

    let headerStyle = {
      padding: `${padding}px`,
      backgroundColor: "#eee",
      borderBottom: "1px solid #ccc",
      marginBottom: `${padding}px`,
      textAlign: "left",
      position: "fixed",
      width: "100%",
      height: `${headerHeight}px`,
      top: "0",
      boxSizing: "border-box"
    };

    let navStyle = {
      height: `${navHeight}px`,
      position: "fixed",
      top: `${headerHeight}px`,
      width: "100%",
      backgroundColor: "#fff",
      borderBottom: "1px solid #eee",
      paddingTop: `${padding}px`,
      paddingLeft: `${padding}px`
    };

    let bodyStyle = {
      paddingTop: `${marginTop + padding}px`,
    };

    let bookWrapperStyle = {
      position: "fixed",
      width: "100%",
      top: `${marginTop}`,
      height: `calc(100% - ${marginTop}px)`,
      backgroundColor: "white",
      zIndex: 100,
      overflowY: "scroll"
    };

    return (
      <div className="browser" style={{ fontFamily: "Arial, sans-serif" }}>
        <SkipNavigationLink />

        { this.props.isFetching && <LoadingIndicator /> }
        { this.props.error &&
          <ErrorMessage
            message={this.props.error}
            retry={() => this.props.setCollectionAndBook(this.props.collectionUrl, null)} />
        }

        { showUrlForm &&
          <UrlForm setCollectionAndBook={this.props.setCollectionAndBook} url={this.props.collectionUrl} />
        }

        { showHeader &&
          <div
            className="header"
            style={headerStyle}
            role="banner">
            { this.props.collectionData && this.props.collectionData.search &&
              <div style={{ float: "right" }}>
                <Search
                  url={this.props.collectionData.search.url}
                  searchData={this.props.collectionData.search.searchData}
                  fetchSearchDescription={this.props.fetchSearchDescription}
                  setCollectionAndBook={this.props.setCollectionAndBook} />
              </div>
            }
            <h1 className="headerTitle" style={{ margin: 0 }}>{headerTitle}</h1>
          </div>
        }

        { showBreadcrumbs &&
          <div className="breadcrumbsWrapper" style={navStyle}>
            <Breadcrumbs
              history={this.props.history}
              collection={this.props.collectionData}
              pathFor={this.props.pathFor}
              setCollectionAndBook={this.props.setCollectionAndBook}
              showCurrentLink={!!this.props.bookData} />
          </div>
        }

        <div className="body" style={bodyStyle}>
          { showBookWrapper &&
            ( showBook && BookDetailsContainer ?
              <BookDetailsContainer book={this.props.bookData}>
                <BookDetails book={this.props.bookData} links={this.props.bookLinks} />
              </BookDetailsContainer> :
              <div className="bookDetailsWrapper" style={bookWrapperStyle}>
                { showBook && <BookDetails book={this.props.bookData} links={this.props.bookLinks} /> }
              </div>
            )
          }

          { showCollection &&
            <Collection
              collection={this.props.collectionData}
              setCollectionAndBook={this.props.setCollectionAndBook}
              fetchPage={this.props.fetchPage}
              isFetching={this.props.isFetching}
              isFetchingPage={this.props.isFetchingPage}
              error={this.props.error}
              fetchSearchDescription={this.props.fetchSearchDescription}
              setBook={this.props.setBook}
              pathFor={this.props.pathFor}
              history={this.props.history} />
          }
        </div>
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