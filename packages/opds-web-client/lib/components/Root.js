"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var prop_types_1 = require("prop-types");
var react_redux_1 = require("react-redux");
var mergeRootProps_1 = require("./mergeRootProps");
var BookDetails_1 = require("./BookDetails");
var LoadingIndicator_1 = require("./LoadingIndicator");
var ErrorMessage_1 = require("./ErrorMessage");
var AuthProviderSelectionForm_1 = require("./AuthProviderSelectionForm");
var Search_1 = require("./Search");
var Breadcrumbs_1 = require("./Breadcrumbs");
var Collection_1 = require("./Collection");
var UrlForm_1 = require("./UrlForm");
var SkipNavigationLink_1 = require("./SkipNavigationLink");
var CatalogLink_1 = require("./CatalogLink");
/** The root component of the application that connects to the Redux store and
    passes props to other components. */
var Root = /** @class */ (function (_super) {
    __extends(Root, _super);
    function Root(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {};
        return _this;
    }
    Root.prototype.render = function () {
        var _this = this;
        var BookDetailsContainer = this.props.BookDetailsContainer;
        var Header = this.props.Header;
        var Footer = this.props.Footer;
        var CollectionContainer = this.props.CollectionContainer;
        var collectionTitle = this.props.collectionData ? this.props.collectionData.title : null;
        var bookTitle = this.props.bookData ? this.props.bookData.title : null;
        var computeBreadcrumbs = this.props.computeBreadcrumbs || Breadcrumbs_1.defaultComputeBreadcrumbs;
        var breadcrumbsLinks = computeBreadcrumbs(this.props.collectionData, this.props.history);
        var showCollection = this.props.collectionData && !this.props.bookData;
        var showBook = this.props.bookData;
        var showBookWrapper = this.props.bookUrl || this.props.bookData;
        var showUrlForm = !this.props.collectionUrl && !this.props.bookUrl;
        var showBreadcrumbs = this.props.collectionData && breadcrumbsLinks.length > 0;
        var showSearch = this.props.collectionData && this.props.collectionData.search;
        var showFooter = this.props.collectionData && Footer;
        // The tabs should only display if the component is passed and if
        // the catalog is being displayed and not a book.
        var showCollectionContainer = !!CollectionContainer && !showBook;
        var facetGroups = this.props.collectionData ?
            this.props.collectionData.facetGroups : [];
        var allLanguageSearch = this.props.allLanguageSearch;
        return (React.createElement("div", { className: "catalog" },
            React.createElement(SkipNavigationLink_1.default, { target: "#main" }),
            Header ?
                React.createElement(Header, { collectionTitle: collectionTitle, bookTitle: bookTitle, loansUrl: this.props.loansUrl, isSignedIn: this.props.isSignedIn, fetchLoans: this.props.fetchLoans, clearAuthCredentials: this.props.clearAuthCredentials }, showSearch &&
                    React.createElement(Search_1.default, { url: this.props.collectionData.search.url, searchData: this.props.collectionData.search.searchData, fetchSearchDescription: this.props.fetchSearchDescription, allLanguageSearch: allLanguageSearch })) :
                React.createElement("nav", { className: "header navbar navbar-default", role: "navigation" },
                    React.createElement("div", { className: "container-fluid" },
                        React.createElement("span", { className: "navbar-brand" }, "OPDS Web Client"),
                        this.props.loansUrl &&
                            React.createElement("ul", { className: "nav navbar-nav" },
                                React.createElement("li", null,
                                    React.createElement(CatalogLink_1.default, { collectionUrl: this.props.loansUrl, bookUrl: null }, "My Books")),
                                React.createElement("li", null, this.props.isSignedIn &&
                                    React.createElement("a", { onClick: this.props.clearAuthCredentials }, "Sign Out"))))),
            (showBreadcrumbs || showSearch) &&
                React.createElement("div", { className: "breadcrumbs-or-search-wrapper" },
                    showBreadcrumbs &&
                        React.createElement(Breadcrumbs_1.default, { links: breadcrumbsLinks, currentLink: !!showBook }),
                    showSearch &&
                        React.createElement(Search_1.default, { url: this.props.collectionData.search.url, searchData: this.props.collectionData.search.searchData, fetchSearchDescription: this.props.fetchSearchDescription, allLanguageSearch: allLanguageSearch })),
            React.createElement("main", { id: "main", className: "main", role: "main", tabIndex: -1 },
                this.state.authError &&
                    React.createElement(ErrorMessage_1.default, { message: this.state.authError, close: function () { _this.setState({ authError: null }); } }),
                this.props.error && (!this.props.auth || !this.props.auth.showForm) &&
                    React.createElement(ErrorMessage_1.default, { message: "Could not fetch data: " + this.props.error.url, retry: this.props.retryCollectionAndBook }),
                (this.props.isFetchingCollection || this.props.isFetchingBook) &&
                    React.createElement(LoadingIndicator_1.default, null),
                this.props.auth && this.props.auth.showForm &&
                    React.createElement(AuthProviderSelectionForm_1.default, { saveCredentials: this.props.saveAuthCredentials, hide: this.props.closeErrorAndHideAuthForm, callback: this.props.auth.callback, cancel: this.props.auth.cancel, title: this.props.auth.title, error: this.props.auth.error, attemptedProvider: this.props.auth.attemptedProvider, providers: this.props.auth.providers }),
                showUrlForm &&
                    React.createElement(UrlForm_1.default, { collectionUrl: this.props.collectionUrl }),
                React.createElement("div", { className: "body" },
                    showBookWrapper &&
                        React.createElement("div", { className: "book-details-wrapper" }, showBook &&
                            (BookDetailsContainer && (this.props.bookUrl || this.props.bookData.url) ?
                                React.createElement(BookDetailsContainer, { book: this.loanedBookData(this.props.bookData, this.props.bookUrl), bookUrl: this.props.bookUrl || this.props.bookData.url, collectionUrl: this.props.collectionUrl, refreshCatalog: this.props.refreshCollectionAndBook },
                                    React.createElement(BookDetails_1.default, { book: this.loanedBookData(this.props.bookData, this.props.bookUrl), updateBook: this.props.updateBook, fulfillBook: this.props.fulfillBook, indirectFulfillBook: this.props.indirectFulfillBook, isSignedIn: this.props.isSignedIn, epubReaderUrlTemplate: this.props.epubReaderUrlTemplate })) :
                                React.createElement("div", { className: "without-container" },
                                    React.createElement(BookDetails_1.default, { book: this.loanedBookData(this.props.bookData, this.props.bookUrl), updateBook: this.props.updateBook, fulfillBook: this.props.fulfillBook, indirectFulfillBook: this.props.indirectFulfillBook, isSignedIn: this.props.isSignedIn, epubReaderUrlTemplate: this.props.epubReaderUrlTemplate })))),
                    showCollection ?
                        (showCollectionContainer ?
                            React.createElement(CollectionContainer, null,
                                React.createElement(Collection_1.default, { collection: this.collectionDataWithLoans(), fetchPage: this.props.fetchPage, isFetchingCollection: this.props.isFetchingCollection, isFetchingBook: this.props.isFetchingBook, isFetchingPage: this.props.isFetchingPage, error: this.props.error, updateBook: this.props.updateBook, fulfillBook: this.props.fulfillBook, indirectFulfillBook: this.props.indirectFulfillBook, isSignedIn: this.props.isSignedIn, epubReaderUrlTemplate: this.props.epubReaderUrlTemplate, preferences: this.props.preferences, setPreference: this.props.setPreference })) :
                            React.createElement(Collection_1.default, { collection: this.collectionDataWithLoans(), fetchPage: this.props.fetchPage, isFetchingCollection: this.props.isFetchingCollection, isFetchingBook: this.props.isFetchingBook, isFetchingPage: this.props.isFetchingPage, error: this.props.error, updateBook: this.props.updateBook, fulfillBook: this.props.fulfillBook, indirectFulfillBook: this.props.indirectFulfillBook, isSignedIn: this.props.isSignedIn, epubReaderUrlTemplate: this.props.epubReaderUrlTemplate, preferences: this.props.preferences, setPreference: this.props.setPreference })) : null)),
            showFooter &&
                React.createElement("footer", null,
                    React.createElement(Footer, { collection: this.props.collectionData }))));
    };
    Root.prototype.componentWillMount = function () {
        var _this = this;
        this.updatePageTitle(this.props);
        if (this.props.authCredentials && this.props.saveAuthCredentials) {
            this.props.saveAuthCredentials(this.props.authCredentials);
        }
        var authError;
        if (this.props.authPlugins) {
            this.props.authPlugins.forEach(function (plugin) {
                var result = plugin.lookForCredentials();
                if (result && result.error) {
                    authError = result.error;
                }
                if (result && result.credentials && _this.props.saveAuthCredentials) {
                    _this.props.saveAuthCredentials(result.credentials);
                }
            });
        }
        if (authError) {
            this.setState({ authError: authError });
        }
        else if (this.props.collectionUrl || this.props.bookUrl) {
            return this.props.setCollectionAndBook(this.props.collectionUrl, this.props.bookUrl).then(function (_a) {
                var collectionData = _a.collectionData, bookData = _a.bookData;
                if (_this.props.authCredentials && collectionData && collectionData.shelfUrl) {
                    _this.props.fetchLoans(collectionData.shelfUrl);
                }
            });
        }
    };
    Root.prototype.componentWillReceiveProps = function (nextProps) {
        if (nextProps.collectionUrl !== this.props.collectionUrl || nextProps.bookUrl !== this.props.bookUrl) {
            this.props.setCollectionAndBook(nextProps.collectionUrl, nextProps.bookUrl);
        }
        this.updatePageTitle(nextProps);
    };
    Root.prototype.updatePageTitle = function (props) {
        if (typeof document !== "undefined" && props.pageTitleTemplate) {
            var collectionTitle = props.collectionData && props.collectionData.title;
            var bookTitle = props.bookData && props.bookData.title;
            document.title = props.pageTitleTemplate(collectionTitle, bookTitle);
        }
    };
    Root.prototype.showPrevBook = function () {
        this.showRelativeBook(-1);
    };
    Root.prototype.showNextBook = function () {
        this.showRelativeBook(1);
    };
    Root.prototype.showRelativeBook = function (relativeIndex) {
        if (this.context.router && this.props.collectionData && this.props.bookData) {
            var books = this.props.collectionData.lanes.reduce(function (books, lane) {
                return books.concat(lane.books);
            }, this.props.collectionData.books);
            var bookIds = books.map(function (book) { return book.id; });
            var currentBookIndex = bookIds.indexOf(this.props.bookData.id);
            if (currentBookIndex !== -1) {
                // wrap index at start and end of bookIds array
                var nextBookIndex = (currentBookIndex + relativeIndex + bookIds.length) % bookIds.length;
                var nextBookUrl = books[nextBookIndex].url || books[nextBookIndex].id;
                this.context.router.push(this.context.pathFor(this.props.collectionData.url, nextBookUrl));
            }
        }
    };
    ;
    Root.prototype.loanedBookData = function (book, bookUrl) {
        if (!this.props.loans || this.props.loans.length === 0) {
            return book;
        }
        var loan = this.props.loans.find(function (loanedBook) {
            if (book) {
                return loanedBook.id === book.id;
            }
            else if (bookUrl) {
                return loanedBook.url === bookUrl;
            }
            else {
                return false;
            }
        });
        return loan || book;
    };
    Root.prototype.collectionDataWithLoans = function () {
        var _this = this;
        // If any books in the collection are in the loans feed, replace them with their
        // loaned version. This currently only changes ungrouped books, not books in lanes,
        // since lanes don't need any loan-related information.
        return Object.assign({}, this.props.collectionData, {
            books: this.props.collectionData.books.map(function (book) { return _this.loanedBookData(book); })
        });
    };
    Root.contextTypes = {
        router: prop_types_1.PropTypes.object,
        pathFor: prop_types_1.PropTypes.func
    };
    return Root;
}(React.Component));
exports.Root = Root;
var connectOptions = { withRef: true, pure: false };
var ConnectedRoot = react_redux_1.connect(mergeRootProps_1.mapStateToProps, mergeRootProps_1.mapDispatchToProps, mergeRootProps_1.mergeRootProps, connectOptions)(Root);
exports.default = ConnectedRoot;
