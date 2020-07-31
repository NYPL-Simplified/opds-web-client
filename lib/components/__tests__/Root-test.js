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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var sinon_1 = require("sinon");
var React = require("react");
var PropTypes = require("prop-types");
var enzyme_1 = require("enzyme");
var Root_1 = require("../Root");
var Breadcrumbs_1 = require("../Breadcrumbs");
var Collection_1 = require("../Collection");
var UrlForm_1 = require("../UrlForm");
var BookDetails_1 = require("../BookDetails");
var SkipNavigationLink_1 = require("../SkipNavigationLink");
var CatalogLink_1 = require("../CatalogLink");
var Search_1 = require("../Search");
var LoadingIndicator_1 = require("../LoadingIndicator");
var ErrorMessage_1 = require("../ErrorMessage");
var AuthProviderSelectionForm_1 = require("../AuthProviderSelectionForm");
var collectionData_1 = require("./collectionData");
var routing_1 = require("../../__mocks__/routing");
var book = {
    id: "urn:librarysimplified.org/terms/id/3M%20ID/crrmnr9",
    title: "The Mayan Secrets",
    authors: ["Clive Cussler", "Thomas Perry"],
    summary: "<strong>Sam and Remi Fargo race for treasure&#8212;and survival&#8212;in this lightning-paced new adventure from #1&lt;i&gt; New York Times&lt;/i&gt; bestselling author Clive Cussler.</strong><br />Husband-and-wife team Sam and Remi Fargo are in Mexico when they come upon a remarkable discovery&#8212;the mummified remainsof a man clutching an ancient sealed pot. Within the pot is a Mayan book larger than any known before.<br />The book contains astonishing information about the Mayans, their cities, and about mankind itself. The secrets are so powerful that some people would do anything to possess them&#8212;as the Fargos are about to find out.",
    imageUrl: "https://dlotdqc6pnwqb.cloudfront.net/3M/crrmnr9/cover.jpg",
    openAccessLinks: [
        { url: "secrets.epub", type: "application/epub+zip" },
        { url: "secrets.mobi", type: "application/x-mobipocket-ebook" }
    ],
    borrowUrl: "borrow url",
    publisher: "Penguin Publishing Group",
    published: "February 29, 2016",
    categories: ["category 1", "category 2"],
    series: {
        name: "Fake Series"
    },
    language: "de",
    raw: {
        $: { "schema:additionalType": { value: "http://bib.schema.org/Audiobook" } }
    }
};
var setCollectionAndBookPromise = new Promise(function (resolve, reject) {
    resolve({
        collectionData: null,
        bookData: null
    });
});
var mockSetCollectionAndBook = sinon_1.stub().returns(setCollectionAndBookPromise);
var fulfillBook = function (url) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, new Blob()];
}); }); };
var updateBook = function (url) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, book];
}); }); };
var indirectFulfillBook = function (url, type) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, "test value"];
}); }); };
var setPreference = function () { return null; };
describe("Root", function () {
    it("shows skip navigation link", function () {
        var wrapper = enzyme_1.shallow(React.createElement(Root_1.Root, { fulfillBook: fulfillBook, indirectFulfillBook: indirectFulfillBook, updateBook: updateBook, setPreference: setPreference }));
        var links = wrapper.find(SkipNavigationLink_1.default);
        chai_1.expect(links.length).to.equal(1);
    });
    it("contains main element", function () {
        var wrapper = enzyme_1.shallow(React.createElement(Root_1.Root, { fulfillBook: fulfillBook, indirectFulfillBook: indirectFulfillBook, updateBook: updateBook, setPreference: setPreference }));
        var main = wrapper.find("main");
        chai_1.expect(main.props().role).to.equal("main");
    });
    it("shows search and treats it as top-level", function () {
        var collectionData = Object.assign({}, collectionData_1.ungroupedCollectionData, {
            search: {
                url: "test search url",
                searchData: {
                    description: "description",
                    shortName: "shortName",
                    template: function (s) { return s; }
                }
            }
        });
        var fetchSearchDescription = function (url) { };
        var wrapper = enzyme_1.shallow(React.createElement(Root_1.Root, { fulfillBook: fulfillBook, indirectFulfillBook: indirectFulfillBook, updateBook: updateBook, setPreference: setPreference, collectionData: collectionData, fetchSearchDescription: fetchSearchDescription }));
        var search = wrapper.find(Search_1.default);
        chai_1.expect(search.props().url).to.equal(collectionData.search.url);
        chai_1.expect(search.props().searchData).to.equal(collectionData.search.searchData);
        chai_1.expect(search.props().fetchSearchDescription).to.equal(fetchSearchDescription);
    });
    it("shows a collection if props include collectionData", function () {
        var collectionData = collectionData_1.groupedCollectionData;
        var wrapper = enzyme_1.shallow(React.createElement(Root_1.Root, { fulfillBook: fulfillBook, indirectFulfillBook: indirectFulfillBook, updateBook: updateBook, setPreference: setPreference, collectionData: collectionData }));
        var collections = wrapper.find(Collection_1.default);
        chai_1.expect(collections.length).to.equal(1);
        chai_1.expect(collections.first().props().collection).to.deep.equal(collectionData);
    });
    it("shows a (non-grouped) collection with loans if props include collectionData and loans", function () {
        var collectionData = collectionData_1.ungroupedCollectionData;
        // One book is on loan.
        var loan = Object.assign({}, collectionData.books[1], {
            fulfillmentLinks: [{ url: "fulfill", type: "text/html" }]
        });
        var loans = [loan];
        var wrapper = enzyme_1.shallow(React.createElement(Root_1.Root, { fulfillBook: fulfillBook, indirectFulfillBook: indirectFulfillBook, updateBook: updateBook, setPreference: setPreference, collectionData: collectionData, loans: loans }));
        var collections = wrapper.find(Collection_1.default);
        chai_1.expect(collections.length).to.equal(1);
        var expectedBooks = [
            collectionData.books[0],
            loan,
            collectionData.books[2]
        ];
        var expectedCollection = Object.assign({}, collectionData, {
            books: expectedBooks
        });
        chai_1.expect(collections.first().props().collection).to.deep.equal(expectedCollection);
    });
    it("shows a url form if no collection url or book url", function () {
        var wrapper = enzyme_1.shallow(React.createElement(Root_1.Root, { fulfillBook: fulfillBook, indirectFulfillBook: indirectFulfillBook, updateBook: updateBook, setPreference: setPreference }));
        var urlForms = wrapper.find(UrlForm_1.default);
        chai_1.expect(urlForms.length).to.equal(1);
    });
    it("doesn't show a url form if collection url", function () {
        var wrapper = enzyme_1.shallow(React.createElement(Root_1.Root, { fulfillBook: fulfillBook, indirectFulfillBook: indirectFulfillBook, updateBook: updateBook, setPreference: setPreference, collectionUrl: "test", setCollectionAndBook: mockSetCollectionAndBook }));
        var urlForms = wrapper.find(UrlForm_1.default);
        chai_1.expect(urlForms.length).to.equal(0);
    });
    it("doesn't show a url form if book url", function () {
        var wrapper = enzyme_1.shallow(React.createElement(Root_1.Root, { fulfillBook: fulfillBook, indirectFulfillBook: indirectFulfillBook, updateBook: updateBook, setPreference: setPreference, bookUrl: "test", setCollectionAndBook: mockSetCollectionAndBook }));
        var urlForms = wrapper.find(UrlForm_1.default);
        chai_1.expect(urlForms.length).to.equal(0);
    });
    it("fetches a collection url on mount", function () {
        var collectionUrl = "http://feedbooks.github.io/opds-test-catalog/catalog/acquisition/blocks.xml";
        var setCollectionAndBook = sinon_1.stub().returns(setCollectionAndBookPromise);
        var wrapper = enzyme_1.shallow(React.createElement(Root_1.Root, { fulfillBook: fulfillBook, indirectFulfillBook: indirectFulfillBook, updateBook: updateBook, setPreference: setPreference, collectionUrl: collectionUrl, setCollectionAndBook: setCollectionAndBook }));
        chai_1.expect(setCollectionAndBook.callCount).to.equal(1);
        chai_1.expect(setCollectionAndBook.args[0][0]).to.equal(collectionUrl);
        chai_1.expect(setCollectionAndBook.args[0][1]).not.to.be.ok;
    });
    it("fetches a book url on mount", function () {
        var bookUrl = "http://example.com/book";
        var setCollectionAndBook = sinon_1.stub().returns(setCollectionAndBookPromise);
        var wrapper = enzyme_1.shallow(React.createElement(Root_1.Root, { bookUrl: bookUrl, setCollectionAndBook: setCollectionAndBook, fulfillBook: fulfillBook, indirectFulfillBook: indirectFulfillBook, updateBook: updateBook, setPreference: setPreference }));
        chai_1.expect(setCollectionAndBook.callCount).to.equal(1);
        chai_1.expect(setCollectionAndBook.args[0][0]).not.to.be.ok;
        chai_1.expect(setCollectionAndBook.args[0][1]).to.equal(bookUrl);
    });
    it("fetches loans on mount", function (done) {
        var collectionUrl = "http://feedbooks.github.io/opds-test-catalog/catalog/acquisition/blocks.xml";
        var setCollectionAndBook = function (collectionUrl, bookUrl) {
            return new Promise(function (resolve, reject) {
                return resolve({
                    collectionData: Object.assign({}, collectionData_1.ungroupedCollectionData, {
                        shelfUrl: "loans url"
                    }),
                    bookData: null
                });
            });
        };
        var fetchLoans = sinon_1.stub();
        var credentials = { provider: "test", credentials: "credentials" };
        var wrapper = enzyme_1.shallow(React.createElement(Root_1.Root, { collectionUrl: collectionUrl, setCollectionAndBook: setCollectionAndBook, fetchLoans: fetchLoans, authCredentials: credentials, fulfillBook: fulfillBook, indirectFulfillBook: indirectFulfillBook, updateBook: updateBook, setPreference: setPreference }));
        wrapper.instance()
            .componentWillMount()
            .then(function () {
            var count = fetchLoans.callCount;
            chai_1.expect(fetchLoans.args[count - 1][0]).to.equal("loans url");
            done();
        })
            .catch(function (err) {
            console.log(err);
            throw err;
        });
    });
    it("updates page title on mount", function () {
        var wrapper = enzyme_1.shallow(React.createElement(Root_1.Root, { pageTitleTemplate: function (collection, book) { return "page title"; }, fulfillBook: fulfillBook, indirectFulfillBook: indirectFulfillBook, updateBook: updateBook, setPreference: setPreference }));
        chai_1.expect(document.title).to.equal("page title");
    });
    it("sets auth credentials on mount", function () {
        var credentials = { provider: "test", credentials: "credentials" };
        var saveAuthCredentials = sinon_1.stub();
        var wrapper = enzyme_1.shallow(React.createElement(Root_1.Root, { saveAuthCredentials: saveAuthCredentials, authCredentials: credentials, fulfillBook: fulfillBook, indirectFulfillBook: indirectFulfillBook, updateBook: updateBook, setPreference: setPreference }));
        chai_1.expect(saveAuthCredentials.callCount).to.equal(1);
        chai_1.expect(saveAuthCredentials.args[0][0]).to.equal(credentials);
    });
    var basicProps = {
        fulfillBook: fulfillBook,
        indirectFulfillBook: indirectFulfillBook,
        updateBook: updateBook,
        setPreference: setPreference
    };
    it("checks for credentials on mount", function () {
        var credentials = { provider: "test", credentials: "credentials" };
        var plugin = {
            type: "test",
            lookForCredentials: sinon_1.stub().returns({ credentials: credentials }),
            formComponent: sinon_1.stub(),
            buttonComponent: sinon_1.stub()
        };
        var propsWithAuthPlugin = __assign({ authPlugins: [plugin], saveAuthCredentials: sinon_1.stub() }, basicProps);
        var wrapper = enzyme_1.shallow(React.createElement(Root_1.Root, __assign({}, propsWithAuthPlugin)));
        chai_1.expect(plugin.lookForCredentials.callCount).to.equal(1);
        chai_1.expect(propsWithAuthPlugin.saveAuthCredentials.callCount).to.equal(1);
        chai_1.expect(propsWithAuthPlugin.saveAuthCredentials.args[0][0]).to.deep.equal(credentials);
    });
    it("sets auth error in state on mount if lookForCredentials returns an error", function () {
        var plugin = {
            type: "test",
            lookForCredentials: sinon_1.stub().returns({ error: "error!" }),
            formComponent: sinon_1.stub(),
            buttonComponent: sinon_1.stub()
        };
        var propsWithAuthPlugin = __assign({ authPlugins: [plugin] }, basicProps);
        var wrapper = enzyme_1.shallow(React.createElement(Root_1.Root, __assign({}, propsWithAuthPlugin)));
        chai_1.expect(plugin.lookForCredentials.callCount).to.equal(1);
        chai_1.expect(wrapper.state().authError).to.equal("error!");
    });
    it("shows error message if there's an auth error in the state", function () {
        var wrapper = enzyme_1.shallow(React.createElement(Root_1.Root, { fulfillBook: fulfillBook, indirectFulfillBook: indirectFulfillBook, updateBook: updateBook, setPreference: setPreference }));
        wrapper.setState({ authError: "error!" });
        var error = wrapper.find(ErrorMessage_1.default);
        chai_1.expect(error.length).to.equal(1);
        chai_1.expect(error.props().message).to.equal("error!");
        error.props().close();
        chai_1.expect(wrapper.state().authError).to.be.null;
    });
    it("fetches a collection url when updated", function () {
        var elem = document.createElement("div");
        var collectionUrl = "http://feedbooks.github.io/opds-test-catalog/catalog/acquisition/blocks.xml";
        var newCollection = "new collection url";
        var setCollectionAndBook = sinon_1.stub().returns(setCollectionAndBookPromise);
        var wrapper = enzyme_1.shallow(React.createElement(Root_1.Root, { fulfillBook: fulfillBook, indirectFulfillBook: indirectFulfillBook, updateBook: updateBook, setPreference: setPreference, collectionUrl: collectionUrl, setCollectionAndBook: setCollectionAndBook }));
        wrapper.setProps({
            collectionUrl: newCollection
        });
        chai_1.expect(setCollectionAndBook.callCount).to.equal(2);
        chai_1.expect(setCollectionAndBook.args[1][0]).to.equal(newCollection);
        chai_1.expect(setCollectionAndBook.args[1][1]).not.to.be.ok;
    });
    it("shows loading message", function () {
        var wrapper = enzyme_1.shallow(React.createElement(Root_1.Root, { fulfillBook: fulfillBook, indirectFulfillBook: indirectFulfillBook, updateBook: updateBook, setPreference: setPreference, isFetchingCollection: true }));
        var loadings = wrapper.find(LoadingIndicator_1.default);
        chai_1.expect(loadings.length).to.equal(1);
        wrapper = enzyme_1.shallow(React.createElement(Root_1.Root, { fulfillBook: fulfillBook, indirectFulfillBook: indirectFulfillBook, updateBook: updateBook, setPreference: setPreference, isFetchingBook: true }));
        loadings = wrapper.find(LoadingIndicator_1.default);
        chai_1.expect(loadings.length).to.equal(1);
    });
    it("shows error message", function () {
        var fetchError = {
            status: 500,
            response: "test error",
            url: "test error url"
        };
        var retry = sinon_1.stub();
        var wrapper = enzyme_1.shallow(React.createElement(Root_1.Root, { fulfillBook: fulfillBook, indirectFulfillBook: indirectFulfillBook, updateBook: updateBook, setPreference: setPreference, error: fetchError, retryCollectionAndBook: retry }));
        var error = wrapper.find(ErrorMessage_1.default);
        chai_1.expect(error.props().message).to.contain(fetchError.url);
        chai_1.expect(error.props().message).to.contain(fetchError.response);
        chai_1.expect(error.props().retry).to.equal(retry);
    });
    it("shows auth provider selection form", function () {
        var auth = {
            showForm: true,
            credentials: { provider: "test", credentials: "gibberish" },
            title: "Super Classified Archive",
            providers: [],
            error: "Invalid Clearance ID and/or Access Key",
            attemptedProvider: "Archive Login",
            callback: sinon_1.stub(),
            cancel: sinon_1.stub()
        };
        var saveAuthCredentials = sinon_1.stub();
        var closeErrorAndHideAuthForm = sinon_1.stub();
        var wrapper = enzyme_1.shallow(React.createElement(Root_1.Root, { fulfillBook: fulfillBook, indirectFulfillBook: indirectFulfillBook, updateBook: updateBook, setPreference: setPreference, auth: auth, saveAuthCredentials: saveAuthCredentials, closeErrorAndHideAuthForm: closeErrorAndHideAuthForm }));
        var form = wrapper.find(AuthProviderSelectionForm_1.default);
        var _a = form.props(), saveCredentials = _a.saveCredentials, hide = _a.hide, callback = _a.callback, cancel = _a.cancel, title = _a.title, error = _a.error, attemptedProvider = _a.attemptedProvider, providers = _a.providers;
        chai_1.expect(saveCredentials).to.equal(saveAuthCredentials);
        chai_1.expect(hide).to.equal(closeErrorAndHideAuthForm);
        chai_1.expect(callback).to.equal(auth.callback);
        chai_1.expect(cancel).to.equal(auth.cancel);
        chai_1.expect(title).to.equal(auth.title);
        chai_1.expect(providers).to.deep.equal(auth.providers);
        chai_1.expect(error).to.equal(auth.error);
        chai_1.expect(attemptedProvider).to.equal(auth.attemptedProvider);
    });
    it("shows book detail", function () {
        var bookData = collectionData_1.groupedCollectionData.lanes[0].books[0];
        var loans = [
            Object.assign({}, bookData, {
                availability: { status: "available" }
            })
        ];
        var updateBook = sinon_1.stub();
        var fulfillBook = sinon_1.stub();
        var indirectFulfillBook = sinon_1.stub();
        var epubReaderUrlTemplate = sinon_1.stub();
        var wrapper = enzyme_1.shallow(React.createElement(Root_1.Root, { bookData: bookData, loans: loans, updateBook: updateBook, fulfillBook: fulfillBook, indirectFulfillBook: indirectFulfillBook, isSignedIn: true, epubReaderUrlTemplate: epubReaderUrlTemplate, setPreference: setPreference }));
        var bookWrapper = wrapper.find(".book-details-wrapper");
        var book = wrapper.find(BookDetails_1.default);
        chai_1.expect(bookWrapper.length).to.equal(1);
        chai_1.expect(book.props().book).to.equal(loans[0]);
        chai_1.expect(book.props().updateBook).to.equal(updateBook);
        chai_1.expect(book.props().isSignedIn).to.equal(true);
        chai_1.expect(book.props().epubReaderUrlTemplate).to.equal(epubReaderUrlTemplate);
    });
    it("shows breadcrumbs", function () {
        var history = [
            {
                id: "2nd id",
                text: "2nd title",
                url: "2nd url"
            },
            {
                id: "last id",
                text: "last title",
                url: "last url"
            }
        ];
        var wrapper = enzyme_1.shallow(React.createElement(Root_1.Root, { fulfillBook: fulfillBook, indirectFulfillBook: indirectFulfillBook, updateBook: updateBook, setPreference: setPreference, collectionData: collectionData_1.ungroupedCollectionData, history: history }));
        var breadcrumbs = wrapper.find(Breadcrumbs_1.default);
        var links = history.concat([
            {
                url: collectionData_1.ungroupedCollectionData.url,
                text: collectionData_1.ungroupedCollectionData.title
            }
        ]);
        chai_1.expect(breadcrumbs.props().links).to.deep.equal(links);
    });
    it("uses custom computeBreadcrumbs function", function () {
        var breadcrumb = {
            url: "breacrumb url",
            text: "breadcrumb text"
        };
        var computeBreadcrumbs = function (data) { return [breadcrumb]; };
        var wrapper = enzyme_1.shallow(React.createElement(Root_1.Root, { fulfillBook: fulfillBook, indirectFulfillBook: indirectFulfillBook, updateBook: updateBook, setPreference: setPreference, collectionData: collectionData_1.ungroupedCollectionData, computeBreadcrumbs: computeBreadcrumbs }));
        var breadcrumbs = wrapper.find(Breadcrumbs_1.default);
        chai_1.expect(breadcrumbs.props().links).to.deep.equal([breadcrumb]);
    });
    describe("provided a BookDetailsContainer", function () {
        var Container = /** @class */ (function (_super) {
            __extends(Container, _super);
            function Container() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Container.prototype.render = function () {
                return React.createElement("div", { className: "container" }, this.props.children);
            };
            return Container;
        }(React.Component));
        it("renders BookDetailsContainer with urls, refresh, and book details", function () {
            var bookData = collectionData_1.groupedCollectionData.lanes[0].books[0];
            var refresh = sinon_1.stub();
            var updateBook = sinon_1.stub();
            var fulfillBook = sinon_1.stub();
            var epubReaderUrlTemplate = sinon_1.stub();
            var wrapper = enzyme_1.shallow(React.createElement(Root_1.Root, { bookData: bookData, bookUrl: bookData.url, collectionUrl: "test collection", refreshCollectionAndBook: refresh, setCollectionAndBook: mockSetCollectionAndBook, BookDetailsContainer: Container, updateBook: updateBook, fulfillBook: fulfillBook, epubReaderUrlTemplate: epubReaderUrlTemplate, setPreference: setPreference, indirectFulfillBook: indirectFulfillBook }));
            var container = wrapper.find(Container);
            var child = container.children().first();
            chai_1.expect(container.props().bookUrl).to.equal(bookData.url);
            chai_1.expect(container.props().collectionUrl).to.equal("test collection");
            chai_1.expect(container.props().refreshCatalog).to.equal(refresh);
            chai_1.expect(container.props().book).to.equal(bookData);
            chai_1.expect(child.type()).to.equal(BookDetails_1.default);
            chai_1.expect(child.props().book).to.equal(bookData);
            chai_1.expect(child.props().epubReaderUrlTemplate).to.equal(epubReaderUrlTemplate);
        });
        it("does not render BookDetailsContainer if bookUrl and bookData.url are missing", function () {
            var bookData = Object.assign({}, collectionData_1.groupedCollectionData.lanes[0].books[0], { url: null });
            var refresh = sinon_1.stub();
            var wrapper = enzyme_1.shallow(React.createElement(Root_1.Root, { bookData: bookData, bookUrl: undefined, collectionUrl: "test collection", refreshCollectionAndBook: refresh, setCollectionAndBook: mockSetCollectionAndBook, BookDetailsContainer: Container, fulfillBook: fulfillBook, indirectFulfillBook: indirectFulfillBook, updateBook: updateBook, setPreference: setPreference }));
            var containers = wrapper.find(Container);
            chai_1.expect(containers.length).to.equal(0);
        });
    });
    it("sets page title after updating", function () {
        var elem = document.createElement("div");
        var collectionData = collectionData_1.ungroupedCollectionData;
        var bookData = collectionData.books[0];
        var pageTitleTemplate = sinon_1.spy(function (collectionTitle, bookTitle) {
            return "testing " + collectionTitle + ", " + bookTitle;
        });
        var wrapper = enzyme_1.shallow(React.createElement(Root_1.Root, { collectionData: collectionData, bookData: bookData, pageTitleTemplate: pageTitleTemplate, fulfillBook: fulfillBook, indirectFulfillBook: indirectFulfillBook, updateBook: updateBook, setPreference: setPreference }));
        // template should be invoked by componentWillMount
        chai_1.expect(pageTitleTemplate.callCount).to.equal(1);
        chai_1.expect(pageTitleTemplate.args[0][0]).to.equal(collectionData.title);
        chai_1.expect(pageTitleTemplate.args[0][1]).to.equal(bookData.title);
        chai_1.expect(document.title).to.equal("testing " + collectionData.title + ", " + bookData.title);
        wrapper.setProps({
            collectionData: null,
            bookData: null,
            pageTitleTemplate: pageTitleTemplate
        });
        // template should be invoked again by componentWillUpdate
        chai_1.expect(pageTitleTemplate.callCount).to.equal(2);
        chai_1.expect(pageTitleTemplate.args[1][0]).to.equal(null);
        chai_1.expect(pageTitleTemplate.args[1][1]).to.equal(null);
        chai_1.expect(document.title).to.equal("testing null, null");
    });
    describe("when given a header component", function () {
        var wrapper;
        var collectionData = Object.assign({}, collectionData_1.ungroupedCollectionData, {
            search: {
                url: "test search url",
                searchData: {
                    description: "description",
                    shortName: "shortName",
                    template: function (s) { return s; }
                }
            }
        });
        var bookData = collectionData_1.ungroupedCollectionData.books[0];
        var fetchLoans;
        var clearAuthCredentials;
        var Header = /** @class */ (function (_super) {
            __extends(Header, _super);
            function Header() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Header.prototype.render = function () {
                return (React.createElement("div", { className: "header" },
                    this.props.children,
                    React.createElement(CatalogLink_1.default, { collectionUrl: "test url" }, "test")));
            };
            return Header;
        }(React.Component));
        beforeEach(function () {
            fetchLoans = sinon_1.stub();
            clearAuthCredentials = sinon_1.stub();
            wrapper = enzyme_1.shallow(React.createElement(Root_1.Root, { Header: Header, collectionData: collectionData, bookData: bookData, fetchSearchDescription: function (url) { }, fetchLoans: fetchLoans, clearAuthCredentials: clearAuthCredentials, isSignedIn: true, loansUrl: "loans", fulfillBook: fulfillBook, indirectFulfillBook: indirectFulfillBook, updateBook: updateBook, setPreference: setPreference }));
        });
        it("renders the header", function () {
            var header = wrapper.find(Header);
            var search = header.childAt(0);
            chai_1.expect(header.props().collectionTitle).to.equal(collectionData.title);
            chai_1.expect(header.props().bookTitle).to.equal(bookData.title);
            chai_1.expect(header.props().isSignedIn).to.equal(true);
            chai_1.expect(header.props().fetchLoans).to.equal(fetchLoans);
            chai_1.expect(header.props().clearAuthCredentials).to.equal(clearAuthCredentials);
            chai_1.expect(header.props().loansUrl).to.equal("loans");
            chai_1.expect(search.type()).to.equal(Search_1.default);
        });
    });
    describe("when given a footer component", function () {
        var wrapper;
        var collectionData = collectionData_1.ungroupedCollectionData;
        var bookData = collectionData_1.ungroupedCollectionData.books[0];
        var Footer = /** @class */ (function (_super) {
            __extends(Footer, _super);
            function Footer() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Footer.prototype.render = function () {
                return React.createElement("div", { className: "footer" });
            };
            return Footer;
        }(React.Component));
        beforeEach(function () {
            wrapper = enzyme_1.shallow(React.createElement(Root_1.Root, { Footer: Footer, collectionData: collectionData, bookData: bookData, fetchSearchDescription: function (url) { }, fulfillBook: fulfillBook, indirectFulfillBook: indirectFulfillBook, updateBook: updateBook, setPreference: setPreference }));
        });
        it("renders the footer", function () {
            var footer = wrapper.find("footer");
            chai_1.expect(footer.length).to.equal(1);
            var footerComponent = footer.childAt(0);
            chai_1.expect(footerComponent.props().collection).to.equal(collectionData);
        });
    });
    describe("showNextBook()", function () {
        var mockPush;
        var context;
        var collectionData;
        var bookData;
        var nextBookData;
        var prevBookData;
        var wrapper;
        beforeEach(function () {
            mockPush = sinon_1.stub();
            context = routing_1.mockRouterContext(mockPush);
            collectionData = collectionData_1.groupedCollectionData;
        });
        it("navigates to second book if currently showing first book", function () {
            bookData = collectionData_1.groupedCollectionData.lanes[0].books[0];
            nextBookData = collectionData_1.groupedCollectionData.lanes[0].books[1];
            wrapper = enzyme_1.shallow(React.createElement(Root_1.Root, { collectionData: collectionData, bookData: bookData, setCollectionAndBook: mockSetCollectionAndBook, fulfillBook: fulfillBook, indirectFulfillBook: indirectFulfillBook, updateBook: updateBook, setPreference: setPreference }), { context: context });
            wrapper.instance().showNextBook();
            chai_1.expect(mockPush.callCount).to.equal(1);
            chai_1.expect(mockPush.args[0][0]).to.equal(context.pathFor(collectionData.url, nextBookData.url));
        });
        it("navigates to first book if currently showing last book", function () {
            var lastIndex = collectionData_1.groupedCollectionData.lanes[0].books.length - 1;
            bookData = collectionData_1.groupedCollectionData.lanes[0].books[lastIndex];
            nextBookData = collectionData_1.groupedCollectionData.lanes[0].books[0];
            wrapper = enzyme_1.shallow(React.createElement(Root_1.Root, { collectionData: collectionData, bookData: bookData, setCollectionAndBook: mockSetCollectionAndBook, fulfillBook: fulfillBook, indirectFulfillBook: indirectFulfillBook, updateBook: updateBook, setPreference: setPreference }), { context: context });
            wrapper.instance().showNextBook();
            chai_1.expect(mockPush.callCount).to.equal(1);
            chai_1.expect(mockPush.args[0][0]).to.equal(context.pathFor(collectionData.url, nextBookData.url));
        });
    });
    describe("showPrevBook()", function () {
        var mockPush;
        var context;
        var collectionData;
        var bookData;
        var nextBookData;
        var prevBookData;
        var wrapper;
        beforeEach(function () {
            mockPush = sinon_1.stub();
            context = routing_1.mockRouterContext(mockPush);
            collectionData = collectionData_1.groupedCollectionData;
        });
        it("navigates to last book if currently showing first book", function () {
            var lastIndex = collectionData_1.groupedCollectionData.lanes[0].books.length - 1;
            bookData = collectionData_1.groupedCollectionData.lanes[0].books[0];
            prevBookData = collectionData_1.groupedCollectionData.lanes[0].books[lastIndex];
            wrapper = enzyme_1.shallow(React.createElement(Root_1.Root, { collectionData: collectionData, bookData: bookData, setCollectionAndBook: mockSetCollectionAndBook, fulfillBook: fulfillBook, indirectFulfillBook: indirectFulfillBook, updateBook: updateBook, setPreference: setPreference }), { context: context });
            wrapper.instance().showPrevBook();
            chai_1.expect(mockPush.callCount).to.equal(1);
            chai_1.expect(mockPush.args[0][0]).to.equal(context.pathFor(collectionData.url, prevBookData.url));
        });
        it("navigates to first book if currently showing second book", function () {
            bookData = collectionData_1.groupedCollectionData.lanes[0].books[1];
            prevBookData = collectionData_1.groupedCollectionData.lanes[0].books[0];
            wrapper = enzyme_1.shallow(React.createElement(Root_1.Root, { collectionData: collectionData, bookData: bookData, setCollectionAndBook: mockSetCollectionAndBook, fulfillBook: fulfillBook, indirectFulfillBook: indirectFulfillBook, updateBook: updateBook, setPreference: setPreference }), { context: context });
            wrapper.instance().showPrevBook();
            chai_1.expect(mockPush.callCount).to.equal(1);
            chai_1.expect(mockPush.args[0][0]).to.equal(context.pathFor(collectionData.url, prevBookData.url));
        });
    });
    describe("routing", function () {
        var store;
        var collectionData = collectionData_1.groupedCollectionData;
        var bookData = collectionData_1.groupedCollectionData.lanes[0].books[0];
        var push, context, childContextTypes;
        var wrapper, root;
        var history;
        beforeEach(function () {
            push = sinon_1.stub();
            context = routing_1.mockRouterContext(push);
            childContextTypes = {
                router: PropTypes.object.isRequired,
                pathFor: PropTypes.func.isRequired
            };
            history = [
                {
                    text: "root title",
                    url: "root url"
                },
                {
                    text: "some title",
                    url: "some url"
                }
            ];
            wrapper = enzyme_1.mount(React.createElement(Root_1.Root, { collectionData: collectionData, bookData: undefined, history: history, fulfillBook: fulfillBook, indirectFulfillBook: indirectFulfillBook, updateBook: updateBook, setPreference: setPreference }), { context: context, childContextTypes: childContextTypes });
        });
        it("uses router to show a collection", function () {
            var collectionLink = wrapper.find(".lane .title").first();
            var collectionUrl = collectionData.lanes[0].url;
            collectionLink.simulate("click", { button: 0 });
            chai_1.expect(push.callCount).to.equal(1);
            chai_1.expect(push.args[0][0]).to.equal(context.pathFor(collectionUrl, null));
        });
        it("uses router to show a book", function () {
            var bookLink = wrapper.find(".book a").first();
            var collectionUrl = collectionData.url;
            var bookUrl = collectionData.lanes[0].books[0].url;
            bookLink.simulate("click", { button: 0 });
            chai_1.expect(push.callCount).to.equal(1);
            chai_1.expect(push.args[0][0]).to.equal(context.pathFor(collectionUrl, bookUrl));
        });
        it("uses router to hide a book", function () {
            wrapper.setProps({ bookData: bookData });
            var collectionLink = wrapper
                .find("ol.breadcrumbs")
                .find(CatalogLink_1.default)
                .last();
            var collectionUrl = collectionData.url;
            collectionLink.simulate("click", { button: 0 });
            chai_1.expect(push.callCount).to.equal(1);
            chai_1.expect(push.args[0][0]).to.equal(context.pathFor(collectionUrl, null));
        });
    });
    describe("provided a CollectionContainer", function () {
        var Tabs = /** @class */ (function (_super) {
            __extends(Tabs, _super);
            function Tabs() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Tabs.prototype.render = function () {
                return React.createElement("div", { className: "tabs-container" });
            };
            return Tabs;
        }(React.Component));
        describe("No CollectionContainer component rendering", function () {
            var history = [
                {
                    id: "2nd id",
                    text: "2nd title",
                    url: "2nd url"
                },
                {
                    id: "last id",
                    text: "last title",
                    url: "last url"
                }
            ];
            it("should not render CollectionContainer if the component is not passed in", function () {
                var wrapper = enzyme_1.shallow(React.createElement(Root_1.Root, { collectionData: collectionData_1.ungroupedCollectionData, history: history, collectionUrl: "/test", setCollectionAndBook: mockSetCollectionAndBook, fulfillBook: fulfillBook, indirectFulfillBook: indirectFulfillBook, updateBook: updateBook, setPreference: setPreference }));
                var container = wrapper.find(Tabs);
                chai_1.expect(container.length).to.equal(0);
            });
            it("should not render CollectionContainer if there is no collection data", function () {
                var wrapper = enzyme_1.shallow(React.createElement(Root_1.Root, { history: history, collectionUrl: "/test", setCollectionAndBook: mockSetCollectionAndBook, fulfillBook: fulfillBook, indirectFulfillBook: indirectFulfillBook, updateBook: updateBook, setPreference: setPreference }));
                var container = wrapper.find(Tabs);
                chai_1.expect(container.length).to.equal(0);
            });
            it("should not render CollectionContainer if the component is passed, but a book is being displayed", function () {
                var bookData = collectionData_1.groupedCollectionData.lanes[0].books[0];
                var wrapper = enzyme_1.shallow(React.createElement(Root_1.Root, { bookData: bookData, CollectionContainer: Tabs, collectionData: collectionData_1.ungroupedCollectionData, history: history, collectionUrl: "/test", setCollectionAndBook: mockSetCollectionAndBook, fulfillBook: fulfillBook, indirectFulfillBook: indirectFulfillBook, updateBook: updateBook, setPreference: setPreference }));
                var container = wrapper.find(Tabs);
                chai_1.expect(container.length).to.equal(0);
            });
        });
        it("renders CollectionContainer", function () {
            var history = [
                {
                    id: "2nd id",
                    text: "2nd title",
                    url: "2nd url"
                },
                {
                    id: "last id",
                    text: "last title",
                    url: "last url"
                }
            ];
            var facetGroups = [
                {
                    facets: [
                        {
                            label: "eBooks",
                            href: "http://circulation.librarysimplified.org/groups/?entrypoint=Book",
                            active: false
                        },
                        {
                            label: "Audiobooks",
                            href: "http://circulation.librarysimplified.org/groups/?entrypoint=Audio",
                            active: false
                        }
                    ],
                    label: "Formats"
                }
            ];
            collectionData_1.ungroupedCollectionData.facetGroups = facetGroups;
            var wrapper = enzyme_1.shallow(React.createElement(Root_1.Root, { collectionData: collectionData_1.ungroupedCollectionData, history: history, collectionUrl: "/test", setCollectionAndBook: mockSetCollectionAndBook, CollectionContainer: Tabs, fulfillBook: fulfillBook, indirectFulfillBook: indirectFulfillBook, updateBook: updateBook, setPreference: setPreference }));
            var container = wrapper.find(Tabs);
            chai_1.expect(container.length).to.equal(1);
        });
    });
});
