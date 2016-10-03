import * as React from "react";
import { Store } from "redux";
import { connect } from "react-redux";
import { State } from "../state";
import {
  mapStateToProps, mapDispatchToProps, mergeRootProps
} from "./mergeRootProps";
import BookDetails from "./BookDetails";
import LoadingIndicator from "./LoadingIndicator";
import ErrorMessage from "./ErrorMessage";
import AuthProviderSelectionForm  from "./AuthProviderSelectionForm";
import Search from "./Search";
import Breadcrumbs, {
  ComputeBreadcrumbs, defaultComputeBreadcrumbs
} from "./Breadcrumbs";
import Collection from "./Collection";
import UrlForm from "./UrlForm";
import SkipNavigationLink from "./SkipNavigationLink";
import CatalogLink from "./CatalogLink";
import {
  CollectionData, BookData, LinkData, StateProps, NavigateContext,
  AuthCallback, AuthProvider, AuthMethod, AuthCredentials
} from "../interfaces";

export interface HeaderProps extends React.Props<any> {
  collectionTitle: string;
  bookTitle: string;
  loansUrl?: string;
  isSignedIn: boolean;
  fetchLoans?: (url: string) => Promise<CollectionData>;
  clearAuthCredentials: () => void;
}

export interface FooterProps extends React.Props<any> {
  collection: CollectionData;
}

export interface BookDetailsContainerProps extends React.Props<any> {
  bookUrl: string;
  collectionUrl: string;
  refreshCatalog: () => Promise<any>;
  book: BookData;
}

export interface RootProps extends StateProps {
  store?: Store<State>;
  collectionUrl?: string;
  bookUrl?: string;
  proxyUrl?: string;
  dispatch?: any;
  setCollectionAndBook?: (collectionUrl: string, bookUrl: string) => Promise<any>;
  clearCollection?: () => void;
  clearBook?: () => void;
  fetchSearchDescription?: (url: string) => void;
  closeError?: () => void;
  fetchBook?: (bookUrl: string) => Promise<BookData>;
  refreshCollectionAndBook?: () => Promise<any>;
  retryCollectionAndBook?: () => Promise<any>;
  pageTitleTemplate?: (collectionTitle: string, bookTitle: string) => string;
  headerTitle?: string;
  fetchPage?: (url: string) => Promise<CollectionData>;
  Header?: new() => __React.Component<HeaderProps, any>;
  Footer?: new() => __React.Component<FooterProps, any>;
  BookDetailsContainer?: new() =>  __React.Component<BookDetailsContainerProps, any>;
  computeBreadcrumbs?: ComputeBreadcrumbs;
  updateBook?: (url: string) => Promise<BookData>;
  fulfillBook?: (url: string) => Promise<Blob>;
  indirectFulfillBook?: (url: string, type: string) => Promise<string>;
  fetchLoans?: (url: string) => Promise<CollectionData>;
  saveAuthCredentials?: (credentials: AuthCredentials) => void;
  clearAuthCredentials?: () => void;
  showAuthForm?: (callback: AuthCallback, providers: AuthProvider<AuthMethod>[], title: string) => void;
  closeErrorAndHideAuthForm?: () => void;
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
    let Footer = this.props.Footer;
    let collectionTitle = this.props.collectionData ? this.props.collectionData.title : null;
    let bookTitle = this.props.bookData ? this.props.bookData.title : null;

    let computeBreadcrumbs = this.props.computeBreadcrumbs || defaultComputeBreadcrumbs;
    let breadcrumbsLinks = computeBreadcrumbs(this.props.collectionData, this.props.history);

    let headerTitle = this.props.headerTitle || (this.props.collectionData ? this.props.collectionData.title : null);

    let showCollection = this.props.collectionData;
    let showBook = this.props.bookData;
    let showBookWrapper = this.props.bookUrl || this.props.bookData;
    let showUrlForm = !this.props.collectionUrl && !this.props.bookUrl;
    let showBreadcrumbs = showCollection && breadcrumbsLinks.length > 0;
    let showFooter = showCollection && Footer;

    let bodyClass = "body";
    if (showBreadcrumbs) {
      bodyClass += " with-breadcrumbs";
    }
    if (showFooter) {
      bodyClass += " with-footer";
    }

    return (
      <div className="catalog">
        <SkipNavigationLink />

        { this.props.error && (!this.props.auth || !this.props.auth.showForm) &&
          <ErrorMessage
            message={"Could not fetch data: " + this.props.error.url}
            retry={this.props.retryCollectionAndBook} />
        }

        { this.props.isFetching &&
          <LoadingIndicator />
        }

        { this.props.auth && this.props.auth.showForm &&
          <AuthProviderSelectionForm
            saveCredentials={this.props.saveAuthCredentials}
            hide={this.props.closeErrorAndHideAuthForm}
            callback={this.props.auth.callback}
            cancel={this.props.auth.cancel}
            title={this.props.auth.title}
            error={this.props.auth.error}
            providers={this.props.auth.providers}
            />
        }

        { showUrlForm &&
          <UrlForm collectionUrl={this.props.collectionUrl} />
        }

        { Header ?
          <Header
            collectionTitle={collectionTitle}
            bookTitle={bookTitle}
            loansUrl={this.props.loansUrl}
            isSignedIn={this.props.isSignedIn}
            fetchLoans={this.props.fetchLoans}
            clearAuthCredentials={this.props.clearAuthCredentials}>
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
              <span className="navbar-brand">
                OPDS Web Client
              </span>

              { this.props.loansUrl &&
                <ul className="nav navbar-nav">
                  <li>
                    <CatalogLink
                      collectionUrl={this.props.loansUrl}
                      bookUrl={null}>
                      Loans
                    </CatalogLink>
                  </li>
                  <li>
                  { this.props.isSignedIn &&
                    <a onClick={this.props.clearAuthCredentials}>Sign Out</a>
                  }
                  </li>
                </ul>
              }

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
          <div className="breadcrumbs-wrapper">
            <Breadcrumbs links={breadcrumbsLinks} />
          </div>
        }

        <div className={bodyClass}>
          { showBookWrapper &&
            <div className="book-details-wrapper">
              { showBook &&
                ( BookDetailsContainer && (this.props.bookUrl || this.props.bookData.url) ?
                  <BookDetailsContainer
                    book={this.loanedBookData() || this.props.bookData}
                    bookUrl={this.props.bookUrl || this.props.bookData.url}
                    collectionUrl={this.props.collectionUrl}
                    refreshCatalog={this.props.refreshCollectionAndBook}
                    >
                    <BookDetails
                      book={this.loanedBookData() || this.props.bookData}
                      updateBook={this.props.updateBook}
                      fulfillBook={this.props.fulfillBook}
                      indirectFulfillBook={this.props.indirectFulfillBook}
                      isSignedIn={this.props.isSignedIn}
                      />
                  </BookDetailsContainer> :
                  <div className="without-container">
                    <BookDetails
                      book={this.loanedBookData() || this.props.bookData}
                      updateBook={this.props.updateBook}
                      fulfillBook={this.props.fulfillBook}
                      indirectFulfillBook={this.props.indirectFulfillBook}
                      isSignedIn={this.props.isSignedIn}
                      />
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
        { showFooter &&
          <footer>
            <Footer collection={this.props.collectionData} />
          </footer>
        }
      </div>
    );
  }

  componentWillMount() {
    this.updatePageTitle(this.props);

    if (this.props.authCredentials && this.props.saveAuthCredentials) {
      this.props.saveAuthCredentials(this.props.authCredentials);
    }

    if (this.props.collectionUrl || this.props.bookUrl) {
      return this.props.setCollectionAndBook(
        this.props.collectionUrl,
        this.props.bookUrl
      ).then(({ collectionData, bookData }) => {
        if (this.props.authCredentials && collectionData.shelfUrl) {
          this.props.fetchLoans(collectionData.shelfUrl);
        }
      });
    }
  }

  componentDidMount() {
    if (typeof document !== "undefined") {
      document.addEventListener("keydown", this.handleKeyDown.bind(this));
    }
  }

  componentWillReceiveProps(nextProps: RootProps) {
    if (nextProps.collectionUrl !== this.props.collectionUrl || nextProps.bookUrl !== this.props.bookUrl) {
      this.props.setCollectionAndBook(nextProps.collectionUrl, nextProps.bookUrl);
    }

    this.updatePageTitle(nextProps);
  }

  updatePageTitle(props) {
    if (typeof document !== "undefined" && props.pageTitleTemplate) {
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

  loanedBookData(): BookData {
    if (!this.props.loans || this.props.loans.length === 0) {
      return null;
    }

    return this.props.loans.find(book => {
      if (this.props.bookData) {
        return book.id === this.props.bookData.id;
      } else if (this.props.bookUrl) {
        return book.url === this.props.bookUrl;
      } else {
        return null;
      }
    });
  }
}

let connectOptions = { withRef: true, pure: false };
const ConnectedRoot = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeRootProps,
  connectOptions
)(Root);

export default ConnectedRoot;