import * as React from "react";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps, mergeRootProps } from "./mergeRootProps";
import BookDetails from "./BookDetails";
import LoadingIndicator from "./LoadingIndicator";
import ErrorMessage from "./ErrorMessage";
import Search from "./Search";
import Breadcrumbs, { BreadcrumbsProps } from "./Breadcrumbs";
import Collection from "./Collection";
import UrlForm from "./UrlForm";
import SkipNavigationLink from "./SkipNavigationLink";
import BrowserLink from "./BrowserLink";
import { CollectionData, BookData, LinkData, State, NavigateContext } from "../interfaces";

export interface HeaderProps extends React.Props<any> {
  BrowserLink: typeof BrowserLink;
}

export interface BookDetailsContainerProps extends React.Props<any> {
  bookUrl: string;
  collectionUrl: string;
  refreshBrowser: () => Promise<any>;
}

export interface RootProps extends State {
  store?: Redux.Store;
  collectionUrl?: string;
  bookUrl?: string;
  proxyUrl?: string;
  dispatch?: any;
  setCollectionAndBook?: (collectionUrl: string, bookUrl: string) => void;
  clearCollection?: () => void;
  clearBook?: () => void;
  fetchSearchDescription?: (url: string) => void;
  closeError?: () => void;
  fetchBook?: (bookUrl: string) => Promise<any>;
  refreshCollectionAndBook?: () => Promise<any>;
  retryCollectionAndBook?: () => Promise<any>;
  pageTitleTemplate?: (collectionTitle: string, bookTitle: string) => string;
  headerTitle?: string;
  fetchPage?: (url: string) => Promise<any>;
  Header?: new() => __React.Component<HeaderProps, any>;
  BookDetailsContainer?: new() =>  __React.Component<BookDetailsContainerProps, any>;
  breadcrumbsProps?: (
    history: LinkData[],
    hierarchy: LinkData[],
    collection: CollectionData,
    book: BookData
  ) => BreadcrumbsProps;
}

export class Root extends React.Component<RootProps, any> {
  context: NavigateContext;

  static contextTypes: React.ValidationMap<RootProps> = {
    router: React.PropTypes.object,
    pathFor: React.PropTypes.func
  };

  render(): JSX.Element {
    let BookDetailsContainer = this.props.BookDetailsContainer;
    let Header = this.props.Header;

    let breadcrumbsProps = this.props.breadcrumbsProps ?
      this.props.breadcrumbsProps(
        this.props.history,
        this.props.hierarchy,
        this.props.collectionData,
        this.props.bookData
      ) : {
        links: this.props.history.length === 0 ?
          [] :
          this.props.history.concat(
            this.props.collectionData ?
            [{
              url: this.props.collectionData.url,
              text: this.props.collectionData.title
            }] :
            []
          ),
        linkToCurrent: !!this.props.bookData
      };

    let headerTitle = this.props.headerTitle || (this.props.collectionData ? this.props.collectionData.title : null);

    let showCollection = this.props.collectionData;
    let showBook = this.props.bookData;
    let showBookWrapper = this.props.bookUrl || this.props.bookData;
    let showUrlForm = !this.props.collectionUrl && !this.props.bookUrl;
    let showBreadcrumbs = showCollection && breadcrumbsProps.links && breadcrumbsProps.links.length > 0;

    let padding = 10;
    let headerHeight = 50;
    let breadcrumbsHeight = showBreadcrumbs ? 40 : 0;
    let marginTop = headerHeight + breadcrumbsHeight;

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

    let breadcrumbsStyle = {
      position: "fixed",
      top: `${headerHeight}px`,
      width: "100%"
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
      transform: "translateZ(0)",
      overflowY: "scroll"
    };

    return (
      <div className="browser" style={{ fontFamily: "Arial, sans-serif" }}>
        <SkipNavigationLink />

        { this.props.error &&
          <ErrorMessage
            message={"Could not fetch data: " + this.props.error.url}
            retry={this.props.retryCollectionAndBook} />
        }

        { this.props.isFetching && <LoadingIndicator /> }

        { showUrlForm &&
          <UrlForm collectionUrl={this.props.collectionUrl} />
        }

        { Header ?
          <Header
            BrowserLink={BrowserLink}>
            { this.props.collectionData && this.props.collectionData.search &&
              <Search
                url={this.props.collectionData.search.url}
                searchData={this.props.collectionData.search.searchData}
                fetchSearchDescription={this.props.fetchSearchDescription}
                />
            }
          </Header> :
          <nav className="header navbar navbar-default navbar-fixed-top">
            <div className="container-fluid">
              <span className="navbar-brand" style={{ fontSize: "1.8em", color: "black" }}>
                OPDS Browser
              </span>
              { this.props.collectionData && this.props.collectionData.search &&
                <Search
                  className="navbar-form navbar-right"
                  url={this.props.collectionData.search.url}
                  searchData={this.props.collectionData.search.searchData}
                  fetchSearchDescription={this.props.fetchSearchDescription}
                  />
              }
            </div>
          </nav>
        }

        { showBreadcrumbs &&
          <div className="breadcrumbsWrapper" style={breadcrumbsStyle}>
            <Breadcrumbs {...breadcrumbsProps} />
          </div>
        }

        <div className="body" style={bodyStyle}>
          { showBookWrapper &&
            <div className="bookDetailsWrapper" style={bookWrapperStyle}>
              { showBook &&
                ( BookDetailsContainer && this.props.bookUrl ?
                  <BookDetailsContainer
                    bookUrl={this.props.bookUrl}
                    collectionUrl={this.props.collectionUrl}
                    refreshBrowser={this.props.refreshCollectionAndBook}>
                    <BookDetails book={this.props.bookData} />
                  </BookDetailsContainer> :
                  <div style={{ padding: "40px", maxWidth: "700px", margin: "0 auto" }}>
                    <BookDetails book={this.props.bookData} />
                  </div>
                )
              }
            </div>
          }

          { showCollection &&
            <Collection
              collection={this.props.collectionData}
              fetchPage={this.props.fetchPage}
              isFetching={this.props.isFetching}
              isFetchingPage={this.props.isFetchingPage}
              error={this.props.error}
              />
          }
        </div>
      </div>
    );
  }

  componentWillMount() {
    if (this.props.collectionUrl || this.props.bookUrl) {
      this.props.setCollectionAndBook(this.props.collectionUrl, this.props.bookUrl);
    }

    this.updatePageTitle(this.props);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  componentWillReceiveProps(nextProps: RootProps) {
    if (nextProps.collectionUrl !== this.props.collectionUrl || nextProps.bookUrl !== this.props.bookUrl) {
      this.props.setCollectionAndBook(nextProps.collectionUrl, nextProps.bookUrl);
    }

    this.updatePageTitle(nextProps);
  }

  updatePageTitle(props) {
    if (props.pageTitleTemplate) {
      let collectionTitle = props.collectionData && props.collectionData.title;
      let bookTitle = props.bookData && props.bookData.title;
      document.title = props.pageTitleTemplate(collectionTitle, bookTitle);
    }
  }

  handleKeyDown(event) {
    if (!event.metaKey && !event.altKey && !event.ctrlKey && !event.shiftKey) {
      // event.keyCode is deprecated but not all browsers support event.code
      if (event.code === "ArrowLeft" || event.keyCode === 37) {
        this.showPrevBook();
      } else if (event.code === "ArrowRight" || event.keyCode === 39) {
        this.showNextBook();
      }
    }
  }

  showPrevBook() {
    this.showRelativeBook(-1);
  }

  showNextBook() {
    this.showRelativeBook(1);
  }

  showRelativeBook (relativeIndex: number) {
    if (this.context.router && this.props.collectionData && this.props.bookData) {
      let books = this.props.collectionData.lanes.reduce((books, lane) => {
        return books.concat(lane.books);
      }, this.props.collectionData.books);
      let bookIds = books.map(book => book.id);
      let currentBookIndex = bookIds.indexOf(this.props.bookData.id);

      if (currentBookIndex !== -1) {
        // wrap index at start and end of bookIds array
        let nextBookIndex = (currentBookIndex + relativeIndex + bookIds.length) % bookIds.length;
        let nextBookUrl = books[nextBookIndex].url || books[nextBookIndex].id;

        this.context.router.push(this.context.pathFor(this.props.collectionData.url, nextBookUrl));
      }
    }
  };
}

let connectOptions = { withRef: true, pure: false };
const ConnectedRoot = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeRootProps,
  connectOptions
)(Root);

export default ConnectedRoot;