import * as React from "react";
import { PropTypes } from "prop-types";
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
import AuthPlugin from "../AuthPlugin";

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

export interface EntryPointsTabsProps extends React.Props<any> {
  list?: any[];
  links?: LinkData[];
  collectionUrl?: string;
  bookPage?: boolean;
}

export interface BookDetailsContainerProps extends React.Props<any> {
  bookUrl: string;
  collectionUrl: string;
  refreshCatalog: () => Promise<any>;
  book: BookData;
}

export interface RootProps extends StateProps {
  store?: Store<State>;
  authPlugins?: AuthPlugin[];
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
  epubReaderUrlTemplate?: (epubUrl: string) => string;
  fetchPage?: (url: string) => Promise<CollectionData>;
  Header?: new() => __React.Component<HeaderProps, any>;
  Footer?: new() => __React.Component<FooterProps, any>;
  EntryPointsTabs?: new() => __React.Component<EntryPointsTabsProps, any>;
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
  setPreference?: (key: string, value: string) => void;
}

export interface RootState {
  authError?: string;
}

/** The root component of the application that connects to the Redux store and
    passes props to other components. */
export class Root extends React.Component<RootProps, RootState> {
  context: NavigateContext;

  static contextTypes: React.ValidationMap<RootProps> = {
    router: PropTypes.object,
    pathFor: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render(): JSX.Element {
    let BookDetailsContainer = this.props.BookDetailsContainer;
    let Header = this.props.Header;
    let Footer = this.props.Footer;
    let EntryPointsTabs = this.props.EntryPointsTabs;
    let collectionTitle = this.props.collectionData ? this.props.collectionData.title : null;
    let bookTitle = this.props.bookData ? this.props.bookData.title : null;

    let computeBreadcrumbs = this.props.computeBreadcrumbs || defaultComputeBreadcrumbs;
    let breadcrumbsLinks = computeBreadcrumbs(this.props.collectionData, this.props.history);

    let showCollection = this.props.collectionData && !this.props.bookData;
    let showBook = this.props.bookData;
    let showBookWrapper = this.props.bookUrl || this.props.bookData;
    let showUrlForm = !this.props.collectionUrl && !this.props.bookUrl;
    let showBreadcrumbs = this.props.collectionData && breadcrumbsLinks.length > 0;
    let showSearch = this.props.collectionData && this.props.collectionData.search;
    let showFooter = this.props.collectionData && Footer;
    let showEntryPointsTabs = !!EntryPointsTabs;

    return (
      <div className="catalog">
        <SkipNavigationLink target="#main" />

        { Header ?
          <Header
            collectionTitle={collectionTitle}
            bookTitle={bookTitle}
            loansUrl={this.props.loansUrl}
            isSignedIn={this.props.isSignedIn}
            fetchLoans={this.props.fetchLoans}
            clearAuthCredentials={this.props.clearAuthCredentials}>
            { showSearch &&
              <Search
                url={this.props.collectionData.search.url}
                searchData={this.props.collectionData.search.searchData}
                fetchSearchDescription={this.props.fetchSearchDescription}
                />
            }
          </Header> :
          <nav className="header navbar navbar-default" role="navigation">
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
                      My Books
                    </CatalogLink>
                  </li>
                  <li>
                  { this.props.isSignedIn &&
                    <a onClick={this.props.clearAuthCredentials}>Sign Out</a>
                  }
                  </li>
                </ul>
              }
            </div>
          </nav>
        }

        { (showBreadcrumbs || showSearch) &&
          <div className="breadcrumbs-or-search-wrapper">
            { showBreadcrumbs &&
              <Breadcrumbs links={breadcrumbsLinks} currentLink={!!showBook} />
            }
            { showSearch &&
              <Search
                url={this.props.collectionData.search.url}
                searchData={this.props.collectionData.search.searchData}
                fetchSearchDescription={this.props.fetchSearchDescription}
                />
            }
          </div>
        }

        { showEntryPointsTabs &&
            <EntryPointsTabs
              links={breadcrumbsLinks}
              collectionUrl={this.props.collectionUrl}
              bookPage={!!showBook}
            />
          }

        <main id="main" className="main" role="main" tabIndex={-1}>

          { this.state.authError &&
            <ErrorMessage
              message={this.state.authError}
              close={() => { this.setState({ authError: null }); }} />
          }

          { this.props.error && (!this.props.auth || !this.props.auth.showForm) &&
            <ErrorMessage
              message={"Could not fetch data: " + this.props.error.url}
              retry={this.props.retryCollectionAndBook} />
          }

          { (this.props.isFetchingCollection || this.props.isFetchingBook) &&
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
              attemptedProvider={this.props.auth.attemptedProvider}
              providers={this.props.auth.providers}
              />
          }

          { showUrlForm &&
            <UrlForm collectionUrl={this.props.collectionUrl} />
          }

          <div className="body">
            { showBookWrapper &&
              <div className="book-details-wrapper">
                { showBook &&
                  ( BookDetailsContainer && (this.props.bookUrl || this.props.bookData.url) ?
                    <BookDetailsContainer
                      book={this.loanedBookData(this.props.bookData, this.props.bookUrl)}
                      bookUrl={this.props.bookUrl || this.props.bookData.url}
                      collectionUrl={this.props.collectionUrl}
                      refreshCatalog={this.props.refreshCollectionAndBook}
                      >
                      <BookDetails
                        book={this.loanedBookData(this.props.bookData, this.props.bookUrl)}
                        updateBook={this.props.updateBook}
                        fulfillBook={this.props.fulfillBook}
                        indirectFulfillBook={this.props.indirectFulfillBook}
                        isSignedIn={this.props.isSignedIn}
                        epubReaderUrlTemplate={this.props.epubReaderUrlTemplate}
                        />
                    </BookDetailsContainer> :
                    <div className="without-container">
                      <BookDetails
                        book={this.loanedBookData(this.props.bookData, this.props.bookUrl)}
                        updateBook={this.props.updateBook}
                        fulfillBook={this.props.fulfillBook}
                        indirectFulfillBook={this.props.indirectFulfillBook}
                        isSignedIn={this.props.isSignedIn}
                        epubReaderUrlTemplate={this.props.epubReaderUrlTemplate}
                        />
                    </div>
                  )
                }
              </div>
            }

            { showCollection &&
              <Collection
                collection={this.collectionDataWithLoans()}
                fetchPage={this.props.fetchPage}
                isFetchingCollection={this.props.isFetchingCollection}
                isFetchingBook={this.props.isFetchingBook}
                isFetchingPage={this.props.isFetchingPage}
                error={this.props.error}
                updateBook={this.props.updateBook}
                fulfillBook={this.props.fulfillBook}
                indirectFulfillBook={this.props.indirectFulfillBook}
                isSignedIn={this.props.isSignedIn}
                epubReaderUrlTemplate={this.props.epubReaderUrlTemplate}
                preferences={this.props.preferences}
                setPreference={this.props.setPreference}
                />
            }
          </div>
        </main>
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

    let authError;
    if (this.props.authPlugins) {
      this.props.authPlugins.forEach(plugin => {
        let result = plugin.lookForCredentials();
        if (result && result.error) {
          authError = result.error;
        }
        if (result && result.credentials && this.props.saveAuthCredentials) {
          this.props.saveAuthCredentials(result.credentials);
        }
      });
    }

    if (authError) {
      this.setState({ authError });
    } else if (this.props.collectionUrl || this.props.bookUrl) {
      return this.props.setCollectionAndBook(
        this.props.collectionUrl,
        this.props.bookUrl
      ).then(({ collectionData, bookData }) => {
        if (this.props.authCredentials && collectionData && collectionData.shelfUrl) {
          this.props.fetchLoans(collectionData.shelfUrl);
        }
      });
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

  loanedBookData(book: BookData | null, bookUrl?: string): BookData {
    if (!this.props.loans || this.props.loans.length === 0) {
      return book;
    }

    let loan = this.props.loans.find(loanedBook => {
      if (book) {
        return loanedBook.id === book.id;
      } else if (bookUrl) {
        return loanedBook.url === bookUrl;
      } else {
        return false;
      }
    });
    return loan || book;
  }

  collectionDataWithLoans(): CollectionData {
    // If any books in the collection are in the loans feed, replace them with their
    // loaned version. This currently only changes ungrouped books, not books in lanes,
    // since lanes don't need any loan-related information.
    return Object.assign({}, this.props.collectionData, {
      books: this.props.collectionData.books.map(book => this.loanedBookData(book))
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
