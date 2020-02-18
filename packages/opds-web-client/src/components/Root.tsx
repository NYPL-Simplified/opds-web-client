import * as React from "react";
import * as PropTypes from "prop-types";
import { Store } from "redux";
import { connect } from "react-redux";
import { State } from "../state";
import {
  mapStateToProps,
  mapDispatchToProps,
  mergeRootProps
} from "./mergeRootProps";
import BookDetails from "./BookDetails";
import LoadingIndicator from "./LoadingIndicator";
import ErrorMessage from "./ErrorMessage";
import AuthProviderSelectionForm from "./AuthProviderSelectionForm";
import Search from "./Search";
import Breadcrumbs, {
  ComputeBreadcrumbs,
  defaultComputeBreadcrumbs
} from "./Breadcrumbs";
import Collection from "./Collection";
import UrlForm from "./UrlForm";
import SkipNavigationLink from "./SkipNavigationLink";
import CatalogLink from "./CatalogLink";
import {
  CollectionData,
  BookData,
  StateProps,
  NavigateContext,
  AuthCallback,
  AuthProvider,
  AuthMethod,
  AuthCredentials,
  FacetGroupData,
  Router as RouterType
} from "../interfaces";
import AuthPlugin from "../AuthPlugin";
import { loanedBookData, collectionDataWithLoans } from "../utils";

export interface HeaderProps extends React.Props<{}> {
  collectionTitle: string | null;
  bookTitle: string | null;
  loansUrl?: string;
  isSignedIn?: boolean;
  fetchLoans?: (url: string) => Promise<CollectionData>;
  clearAuthCredentials?: () => void;
}

export interface FooterProps extends React.Props<{}> {
  collection: CollectionData;
}

export interface CollectionContainerProps extends React.Props<{}> {
  facetGroups?: FacetGroupData[];
}

export interface BookDetailsContainerProps extends React.Props<{}> {
  bookUrl?: string;
  collectionUrl?: string;
  refreshCatalog?: () => Promise<any>;
  book?: BookData | null;
}

export interface RootProps extends StateProps {
  store?: Store<State>;
  authPlugins?: AuthPlugin[];
  collectionUrl?: string;
  bookUrl?: string;
  proxyUrl?: string;
  dispatch?: any;
  setCollectionAndBook?: (
    collectionUrl?: string,
    bookUrl?: string
  ) => Promise<any>;
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
  Header?: React.ComponentClass<HeaderProps, {}>;
  Footer?: React.ComponentClass<FooterProps, {}>;
  CollectionContainer?: React.ComponentClass<CollectionContainerProps, {}>;
  BookDetailsContainer?: React.ComponentClass<BookDetailsContainerProps, {}>;
  computeBreadcrumbs?: ComputeBreadcrumbs;
  updateBook: (url: string) => Promise<BookData>;
  fulfillBook: (url: string) => Promise<Blob>;
  indirectFulfillBook: (url: string, type: string) => Promise<string>;
  fetchLoans?: (url: string) => Promise<CollectionData>;
  saveAuthCredentials?: (credentials: AuthCredentials) => void;
  clearAuthCredentials?: () => void;
  showAuthForm?: (
    callback: AuthCallback,
    providers: AuthProvider<AuthMethod>[],
    title: string
  ) => void;
  closeErrorAndHideAuthForm?: () => void;
  setPreference: (key: string, value: string) => void;
  allLanguageSearch?: boolean;
}

export interface RootState {
  authError?: string | null;
}

/** The root component of the application that connects to the Redux store and
    passes props to other components. */
export class Root extends React.Component<RootProps, RootState> {
  context: NavigateContext;

  static contextTypes: React.ValidationMap<NavigateContext> = {
    router: PropTypes.object as React.Validator<RouterType>,
    pathFor: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render(): JSX.Element {
    let BookDetailsContainer = this.props.BookDetailsContainer;
    let Header = this.props.Header;
    let Footer = this.props.Footer;
    let CollectionContainer = this.props.CollectionContainer;
    let collectionTitle = this.props.collectionData
      ? this.props.collectionData.title
      : null;
    let bookTitle = this.props.bookData ? this.props.bookData.title : null;

    let computeBreadcrumbs =
      this.props.computeBreadcrumbs || defaultComputeBreadcrumbs;
    let breadcrumbsLinks = computeBreadcrumbs(
      this.props.collectionData,
      this.props.history
    );
    let showBreadcrumbs =
      this.props.collectionData && breadcrumbsLinks.length > 0;

    let showCollection = this.props.collectionData && !this.props.bookData;
    const showBook = !!this.props.bookData;
    let showBookWrapper = this.props.bookUrl || this.props.bookData;
    let showUrlForm = !this.props.collectionUrl && !this.props.bookUrl;
    let showSearch =
      this.props.collectionData && this.props.collectionData.search;
    // The tabs should only display if the component is passed and if
    // the catalog is being displayed and not a book.
    let showCollectionContainer = !!CollectionContainer && !showBook;
    let allLanguageSearch = this.props.allLanguageSearch;
    let hasError =
      this.props.error && (!this.props.auth || !this.props.auth.showForm);
    let errorMessage = "";
    if (hasError) {
      errorMessage = `Could not fetch data: ${this.props.error?.url}\n
        ${this.props.error?.response}`;
    }

    return (
      <div className="catalog">
        <SkipNavigationLink target="#main" />

        {Header ? (
          <Header
            collectionTitle={collectionTitle}
            bookTitle={bookTitle}
            loansUrl={this.props.loansUrl}
            isSignedIn={this.props.isSignedIn}
            fetchLoans={this.props.fetchLoans}
            clearAuthCredentials={this.props.clearAuthCredentials}
          >
            {showSearch && (
              <Search
                url={this.props.collectionData?.search?.url}
                searchData={this.props.collectionData?.search?.searchData}
                fetchSearchDescription={this.props.fetchSearchDescription}
                allLanguageSearch={allLanguageSearch}
              />
            )}
          </Header>
        ) : (
          <nav className="header navbar navbar-default" role="navigation">
            <div className="container-fluid">
              <span className="navbar-brand">OPDS Web Client</span>

              {this.props.loansUrl && (
                <ul className="nav navbar-nav">
                  <li>
                    <CatalogLink
                      collectionUrl={this.props.loansUrl}
                      bookUrl={null}
                    >
                      My Books
                    </CatalogLink>
                  </li>
                  <li>
                    {this.props.isSignedIn && (
                      <button onClick={this.props.clearAuthCredentials}>
                        Sign Out
                      </button>
                    )}
                  </li>
                </ul>
              )}
            </div>
          </nav>
        )}

        {(showBreadcrumbs || showSearch) && (
          <div className="breadcrumbs-or-search-wrapper">
            {showBreadcrumbs && (
              <Breadcrumbs links={breadcrumbsLinks} currentLink={!!showBook} />
            )}
            {showSearch && (
              <Search
                url={this.props.collectionData?.search?.url}
                searchData={this.props.collectionData?.search?.searchData}
                fetchSearchDescription={this.props.fetchSearchDescription}
                allLanguageSearch={allLanguageSearch}
              />
            )}
          </div>
        )}

        <main id="main" className="main" role="main" tabIndex={-1}>
          {this.state.authError && (
            <ErrorMessage
              message={this.state.authError}
              close={() => {
                this.setState({ authError: null });
              }}
            />
          )}

          {hasError && (
            <ErrorMessage
              message={errorMessage}
              retry={this.props.retryCollectionAndBook}
            />
          )}

          {(this.props.isFetchingCollection || this.props.isFetchingBook) && (
            <LoadingIndicator />
          )}

          {this.props.auth && this.props.auth.showForm && (
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
          )}

          {showUrlForm && <UrlForm collectionUrl={this.props.collectionUrl} />}

          <div className="body">
            {showBookWrapper && (
              <div className="book-details-wrapper">
                {this.props.bookData &&
                  (BookDetailsContainer &&
                  (this.props.bookUrl || this.props.bookData?.url) ? (
                    <BookDetailsContainer
                      book={loanedBookData(
                        this.props.bookData,
                        this.props.loans,
                        this.props.bookUrl
                      )}
                      bookUrl={this.props.bookUrl || this.props.bookData?.url}
                      collectionUrl={this.props.collectionUrl}
                      refreshCatalog={this.props.refreshCollectionAndBook}
                    >
                      <BookDetails
                        book={loanedBookData(
                          this.props.bookData,
                          this.props.loans,
                          this.props.bookUrl
                        )}
                        updateBook={this.props.updateBook}
                        isSignedIn={this.props.isSignedIn}
                        epubReaderUrlTemplate={this.props.epubReaderUrlTemplate}
                      />
                    </BookDetailsContainer>
                  ) : (
                    <div className="without-container">
                      <BookDetails
                        book={loanedBookData(
                          this.props.bookData,
                          this.props.loans,
                          this.props.bookUrl
                        )}
                        updateBook={this.props.updateBook}
                        isSignedIn={this.props.isSignedIn}
                        epubReaderUrlTemplate={this.props.epubReaderUrlTemplate}
                      />
                    </div>
                  ))}
              </div>
            )}

            {showCollection ? (
              showCollectionContainer && CollectionContainer ? (
                <CollectionContainer>
                  <Collection
                    collection={collectionDataWithLoans(
                      this.props.collectionData,
                      this.props.loans
                    )}
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
                </CollectionContainer>
              ) : (
                <Collection
                  collection={collectionDataWithLoans(
                    this.props.collectionData,
                    this.props.loans
                  )}
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
              )
            ) : null}
          </div>
        </main>
        {Footer && this.props.collectionData && (
          <footer>
            <Footer collection={this.props.collectionData} />
          </footer>
        )}
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
      return this.props
        .setCollectionAndBook?.(this.props.collectionUrl, this.props.bookUrl)
        .then(({ collectionData, bookData }) => {
          if (
            this.props.authCredentials &&
            collectionData &&
            collectionData.shelfUrl
          ) {
            this.props.fetchLoans?.(collectionData.shelfUrl);
          }
        });
    }
  }

  componentWillReceiveProps(nextProps: RootProps) {
    if (
      nextProps.collectionUrl !== this.props.collectionUrl ||
      nextProps.bookUrl !== this.props.bookUrl
    ) {
      this.props.setCollectionAndBook?.(
        nextProps.collectionUrl,
        nextProps.bookUrl
      );
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

  showRelativeBook(relativeIndex: number) {
    if (
      this.context.router &&
      this.props.collectionData &&
      this.props.bookData
    ) {
      let books = this.props.collectionData.lanes.reduce((books, lane) => {
        return books.concat(lane.books);
      }, this.props.collectionData.books);
      let bookIds = books.map(book => book.id);
      let currentBookIndex = bookIds.indexOf(this.props.bookData.id);

      if (currentBookIndex !== -1) {
        // wrap index at start and end of bookIds array
        let nextBookIndex =
          (currentBookIndex + relativeIndex + bookIds.length) % bookIds.length;
        let nextBookUrl = books[nextBookIndex].url || books[nextBookIndex].id;

        this.context.router.push(
          this.context.pathFor(this.props.collectionData.url, nextBookUrl)
        );
      }
    }
  }
}

let connectOptions = { pure: false };
const ConnectedRoot = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeRootProps,
  connectOptions
)(Root);

export default ConnectedRoot;
