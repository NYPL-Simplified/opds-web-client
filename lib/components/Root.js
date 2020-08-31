"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var PropTypes = require("prop-types");
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
var utils_1 = require("../utils");
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
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        var BookDetailsContainer = this.props.BookDetailsContainer;
        var Header = this.props.Header;
        var Footer = this.props.Footer;
        var CollectionContainer = this.props.CollectionContainer;
        var collectionTitle = this.props.collectionData
            ? this.props.collectionData.title
            : null;
        var bookTitle = this.props.bookData ? this.props.bookData.title : null;
        var computeBreadcrumbs = this.props.computeBreadcrumbs || Breadcrumbs_1.defaultComputeBreadcrumbs;
        var breadcrumbsLinks = computeBreadcrumbs(this.props.collectionData, this.props.history);
        var showBreadcrumbs = this.props.collectionData && breadcrumbsLinks.length > 0;
        var showCollection = this.props.collectionData && !this.props.bookData;
        var showBook = !!this.props.bookData;
        var showBookWrapper = this.props.bookUrl || this.props.bookData;
        var showUrlForm = !this.props.collectionUrl && !this.props.bookUrl;
        var showSearch = this.props.collectionData && this.props.collectionData.search;
        // The tabs should only display if the component is passed and if
        // the catalog is being displayed and not a book.
        var showCollectionContainer = !!CollectionContainer && !showBook;
        var allLanguageSearch = this.props.allLanguageSearch;
        var hasError = this.props.error && (!this.props.auth || !this.props.auth.showForm);
        var errorMessage = "";
        if (hasError) {
            errorMessage = "Could not fetch data: " + ((_a = this.props.error) === null || _a === void 0 ? void 0 : _a.url) + "\n\n        " + ((_b = this.props.error) === null || _b === void 0 ? void 0 : _b.response);
        }
        return (React.createElement("div", { className: "catalog" },
            React.createElement(SkipNavigationLink_1.default, { target: "#main" }),
            Header ? (React.createElement(Header, { collectionTitle: collectionTitle, bookTitle: bookTitle, loansUrl: this.props.loansUrl, isSignedIn: this.props.isSignedIn, fetchLoans: this.props.fetchLoans, clearAuthCredentials: this.props.clearAuthCredentials }, showSearch && (React.createElement(Search_1.default, { url: (_d = (_c = this.props.collectionData) === null || _c === void 0 ? void 0 : _c.search) === null || _d === void 0 ? void 0 : _d.url, searchData: (_f = (_e = this.props.collectionData) === null || _e === void 0 ? void 0 : _e.search) === null || _f === void 0 ? void 0 : _f.searchData, fetchSearchDescription: this.props.fetchSearchDescription, allLanguageSearch: allLanguageSearch })))) : (React.createElement("nav", { className: "header navbar navbar-default", role: "navigation" },
                React.createElement("div", { className: "container-fluid" },
                    React.createElement("span", { className: "navbar-brand" }, "OPDS Web Client"),
                    this.props.loansUrl && (React.createElement("ul", { className: "nav navbar-nav" },
                        React.createElement("li", null,
                            React.createElement(CatalogLink_1.default, { collectionUrl: this.props.loansUrl, bookUrl: null }, "My Books")),
                        React.createElement("li", null, this.props.isSignedIn && (React.createElement("button", { onClick: this.props.clearAuthCredentials }, "Sign Out")))))))),
            (showBreadcrumbs || showSearch) && (React.createElement("div", { className: "breadcrumbs-or-search-wrapper" },
                showBreadcrumbs && (React.createElement(Breadcrumbs_1.default, { links: breadcrumbsLinks, currentLink: !!showBook })),
                showSearch && (React.createElement(Search_1.default, { url: (_h = (_g = this.props.collectionData) === null || _g === void 0 ? void 0 : _g.search) === null || _h === void 0 ? void 0 : _h.url, searchData: (_k = (_j = this.props.collectionData) === null || _j === void 0 ? void 0 : _j.search) === null || _k === void 0 ? void 0 : _k.searchData, fetchSearchDescription: this.props.fetchSearchDescription, allLanguageSearch: allLanguageSearch })))),
            React.createElement("main", { id: "main", className: "main", role: "main", tabIndex: -1 },
                this.state.authError && (React.createElement(ErrorMessage_1.default, { message: this.state.authError, close: function () {
                        _this.setState({ authError: null });
                    } })),
                hasError && (React.createElement(ErrorMessage_1.default, { message: errorMessage, retry: this.props.retryCollectionAndBook })),
                (this.props.isFetchingCollection || this.props.isFetchingBook) && (React.createElement(LoadingIndicator_1.default, null)),
                this.props.auth && this.props.auth.showForm && (React.createElement(AuthProviderSelectionForm_1.default, { saveCredentials: this.props.saveAuthCredentials, hide: this.props.closeErrorAndHideAuthForm, callback: this.props.auth.callback, cancel: this.props.auth.cancel, title: this.props.auth.title, error: this.props.auth.error, attemptedProvider: this.props.auth.attemptedProvider, providers: this.props.auth.providers })),
                showUrlForm && React.createElement(UrlForm_1.default, { collectionUrl: this.props.collectionUrl }),
                React.createElement("div", { className: "body" },
                    showBookWrapper && (React.createElement("div", { className: "book-details-wrapper" }, this.props.bookData &&
                        (BookDetailsContainer &&
                            (this.props.bookUrl || ((_l = this.props.bookData) === null || _l === void 0 ? void 0 : _l.url)) ? (React.createElement(BookDetailsContainer, { book: utils_1.loanedBookData(this.props.bookData, this.props.loans, this.props.bookUrl), bookUrl: this.props.bookUrl || ((_m = this.props.bookData) === null || _m === void 0 ? void 0 : _m.url), collectionUrl: this.props.collectionUrl, refreshCatalog: this.props.refreshCollectionAndBook },
                            React.createElement(BookDetails_1.default, { book: utils_1.loanedBookData(this.props.bookData, this.props.loans, this.props.bookUrl), updateBook: this.props.updateBook, isSignedIn: this.props.isSignedIn, epubReaderUrlTemplate: this.props.epubReaderUrlTemplate }))) : (React.createElement("div", { className: "without-container" },
                            React.createElement(BookDetails_1.default, { book: utils_1.loanedBookData(this.props.bookData, this.props.loans, this.props.bookUrl), updateBook: this.props.updateBook, isSignedIn: this.props.isSignedIn, epubReaderUrlTemplate: this.props.epubReaderUrlTemplate })))))),
                    showCollection ? (showCollectionContainer && CollectionContainer ? (React.createElement(CollectionContainer, null,
                        React.createElement(Collection_1.default, { collection: utils_1.collectionDataWithLoans(this.props.collectionData, this.props.loans), fetchPage: this.props.fetchPage, isFetchingCollection: this.props.isFetchingCollection, isFetchingBook: this.props.isFetchingBook, isFetchingPage: this.props.isFetchingPage, error: this.props.error, updateBook: this.props.updateBook, fulfillBook: this.props.fulfillBook, indirectFulfillBook: this.props.indirectFulfillBook, isSignedIn: this.props.isSignedIn, epubReaderUrlTemplate: this.props.epubReaderUrlTemplate, preferences: this.props.preferences, setPreference: this.props.setPreference }))) : (React.createElement(Collection_1.default, { collection: utils_1.collectionDataWithLoans(this.props.collectionData, this.props.loans), fetchPage: this.props.fetchPage, isFetchingCollection: this.props.isFetchingCollection, isFetchingBook: this.props.isFetchingBook, isFetchingPage: this.props.isFetchingPage, error: this.props.error, updateBook: this.props.updateBook, fulfillBook: this.props.fulfillBook, indirectFulfillBook: this.props.indirectFulfillBook, isSignedIn: this.props.isSignedIn, epubReaderUrlTemplate: this.props.epubReaderUrlTemplate, preferences: this.props.preferences, setPreference: this.props.setPreference }))) : null)),
            Footer && this.props.collectionData && (React.createElement("footer", null,
                React.createElement(Footer, { collection: this.props.collectionData })))));
    };
    Root.prototype.componentWillMount = function () {
        var _this = this;
        var _a, _b;
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
            return (_b = (_a = this.props).setCollectionAndBook) === null || _b === void 0 ? void 0 : _b.call(_a, this.props.collectionUrl, this.props.bookUrl).then(function (_a) {
                var collectionData = _a.collectionData, bookData = _a.bookData;
                var _b, _c;
                if (_this.props.authCredentials &&
                    collectionData &&
                    collectionData.shelfUrl) {
                    (_c = (_b = _this.props).fetchLoans) === null || _c === void 0 ? void 0 : _c.call(_b, collectionData.shelfUrl);
                }
            });
        }
    };
    Root.prototype.componentWillReceiveProps = function (nextProps) {
        var _a, _b;
        if (nextProps.collectionUrl !== this.props.collectionUrl ||
            nextProps.bookUrl !== this.props.bookUrl) {
            (_b = (_a = this.props).setCollectionAndBook) === null || _b === void 0 ? void 0 : _b.call(_a, nextProps.collectionUrl, nextProps.bookUrl);
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
        if (this.context.router &&
            this.props.collectionData &&
            this.props.bookData) {
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
    Root.contextTypes = {
        router: PropTypes.object,
        pathFor: PropTypes.func.isRequired
    };
    return Root;
}(React.Component));
exports.Root = Root;
var connectOptions = { pure: false };
var ConnectedRoot = react_redux_1.connect(mergeRootProps_1.mapStateToProps, mergeRootProps_1.mapDispatchToProps, mergeRootProps_1.mergeRootProps, connectOptions)(Root);
exports.default = ConnectedRoot;
