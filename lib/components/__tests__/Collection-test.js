"use strict";
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
var Collection_1 = require("../Collection");
var Lanes_1 = require("../Lanes");
var Book_1 = require("../Book");
var FacetGroup_1 = require("../FacetGroup");
var SkipNavigationLink_1 = require("../SkipNavigationLink");
var collectionData_1 = require("./collectionData");
var routing_1 = require("../../__mocks__/routing");
describe("Collection", function () {
    var updateBook;
    var fulfillBook;
    var indirectFulfillBook;
    var setPreference;
    beforeEach(function () {
        updateBook = sinon_1.stub();
        fulfillBook = sinon_1.stub();
        indirectFulfillBook = sinon_1.stub();
        setPreference = sinon_1.stub();
    });
    describe("empty collection", function () {
        it("says the collection is empty", function () {
            var collectionData = __assign(__assign({}, collectionData_1.groupedCollectionData), { lanes: [] });
            var wrapper = enzyme_1.mount(React.createElement(Collection_1.default, { collection: collectionData, updateBook: updateBook, fulfillBook: fulfillBook, indirectFulfillBook: indirectFulfillBook, setPreference: setPreference }));
            chai_1.expect(wrapper.text()).to.equal("No books found.");
        });
    });
    describe("collection with lanes", function () {
        var collectionData = collectionData_1.groupedCollectionData;
        var wrapper;
        beforeEach(function () {
            var context = routing_1.mockRouterContext();
            wrapper = enzyme_1.mount(React.createElement(Collection_1.default, { collection: collectionData, updateBook: updateBook, fulfillBook: fulfillBook, indirectFulfillBook: indirectFulfillBook, setPreference: setPreference }), {
                context: context,
                childContextTypes: {
                    router: PropTypes.object,
                    pathFor: PropTypes.func
                }
            });
        });
        it("contains main div", function () {
            var link = wrapper.find("#collection-main");
            chai_1.expect(link.length).to.equal(1);
        });
        it("shows lanes", function () {
            var lanes = wrapper.find(Lanes_1.Lanes);
            chai_1.expect(lanes.props().url).to.equal(collectionData.url);
            chai_1.expect(lanes.props().lanes).to.equal(collectionData.lanes);
        });
        it("doesn't show view toggle buttons", function () {
            var viewToggleButtons = wrapper.find(".view-toggle button");
            chai_1.expect(viewToggleButtons.length).to.equal(0);
        });
    });
    describe("collection without lanes", function () {
        var collectionData = collectionData_1.ungroupedCollectionData;
        var wrapper;
        beforeEach(function () {
            var context = routing_1.mockRouterContext();
            wrapper = enzyme_1.mount(React.createElement(Collection_1.default, { collection: collectionData, updateBook: updateBook, fulfillBook: fulfillBook, indirectFulfillBook: indirectFulfillBook, setPreference: setPreference }), {
                context: context,
                childContextTypes: {
                    router: PropTypes.object,
                    pathFor: PropTypes.func
                }
            });
        });
        it("contains main div", function () {
            var link = wrapper.find("#collection-main");
            chai_1.expect(link.length).to.equal(1);
        });
        it("shows books in order", function () {
            var books = wrapper.find(Book_1.default);
            var bookDatas = books.map(function (book) { return book.props().book; });
            var uniqueCollectionUrls = Array.from(new Set(books.map(function (book) { return book.props().collectionUrl; })));
            chai_1.expect(books.length).to.equal(collectionData.books.length);
            chai_1.expect(bookDatas).to.deep.equal(collectionData.books);
            chai_1.expect(uniqueCollectionUrls).to.deep.equal([collectionData.url]);
        });
        it("shows grid or list view", function () {
            var _a, _b;
            var context = routing_1.mockRouterContext();
            wrapper = enzyme_1.mount(React.createElement(Collection_1.default, { collection: collectionData, updateBook: updateBook, fulfillBook: fulfillBook, indirectFulfillBook: indirectFulfillBook, setPreference: setPreference }), {
                context: context,
                childContextTypes: {
                    router: PropTypes.object,
                    pathFor: PropTypes.func
                }
            });
            var getElements = function () {
                var viewToggleButtons = wrapper.find(".view-toggle button");
                return {
                    viewToggleButtons: viewToggleButtons,
                    gridButton: viewToggleButtons.at(0),
                    listButton: viewToggleButtons.at(1),
                    books: wrapper.find(".books")
                };
            };
            var _c = getElements(), viewToggleButtons = _c.viewToggleButtons, gridButton = _c.gridButton, listButton = _c.listButton, books = _c.books;
            chai_1.expect(viewToggleButtons.length).to.equal(2);
            chai_1.expect(gridButton.props().disabled).to.equal(true);
            chai_1.expect(listButton.props().disabled).to.equal(false);
            chai_1.expect(books.props().className).to.contain(Collection_1.default.GRID_VIEW);
            chai_1.expect(books.props().className).not.to.contain(Collection_1.default.LIST_VIEW);
            var preferences = {};
            preferences[Collection_1.default.VIEW_KEY] = Collection_1.default.LIST_VIEW;
            wrapper.setProps({ preferences: preferences });
            (_a = getElements(), viewToggleButtons = _a.viewToggleButtons, gridButton = _a.gridButton, listButton = _a.listButton, books = _a.books);
            chai_1.expect(gridButton.props().disabled).to.equal(false);
            chai_1.expect(listButton.props().disabled).to.equal(true);
            chai_1.expect(books.props().className).to.contain(Collection_1.default.LIST_VIEW);
            chai_1.expect(books.props().className).not.to.contain(Collection_1.default.GRID_VIEW);
            preferences[Collection_1.default.VIEW_KEY] = Collection_1.default.GRID_VIEW;
            wrapper.setProps({ preferences: preferences });
            (_b = getElements(), viewToggleButtons = _b.viewToggleButtons, gridButton = _b.gridButton, listButton = _b.listButton, books = _b.books);
            chai_1.expect(gridButton.props().disabled).to.equal(true);
            chai_1.expect(listButton.props().disabled).to.equal(false);
            chai_1.expect(books.props().className).to.contain(Collection_1.default.GRID_VIEW);
            chai_1.expect(books.props().className).not.to.contain(Collection_1.default.LIST_VIEW);
        });
        it("sets view preference", function () {
            var context = routing_1.mockRouterContext();
            wrapper = enzyme_1.mount(React.createElement(Collection_1.default, { collection: collectionData, updateBook: updateBook, fulfillBook: fulfillBook, indirectFulfillBook: indirectFulfillBook, setPreference: setPreference }), {
                context: context,
                childContextTypes: {
                    router: PropTypes.object,
                    pathFor: PropTypes.func
                }
            });
            var viewToggleButtons = wrapper.find(".view-toggle button");
            chai_1.expect(viewToggleButtons.length).to.equal(2);
            var gridButton = viewToggleButtons.at(0);
            var listButton = viewToggleButtons.at(1);
            listButton.simulate("click");
            chai_1.expect(setPreference.callCount).to.equal(1);
            chai_1.expect(setPreference.args[0][0]).to.equal(Collection_1.default.VIEW_KEY);
            chai_1.expect(setPreference.args[0][1]).to.equal(Collection_1.default.LIST_VIEW);
            var preferences = {};
            preferences[Collection_1.default.VIEW_KEY] = Collection_1.default.LIST_VIEW;
            wrapper.setProps({ preferences: preferences });
            gridButton.simulate("click");
            chai_1.expect(setPreference.callCount).to.equal(2);
            chai_1.expect(setPreference.args[1][0]).to.equal(Collection_1.default.VIEW_KEY);
            chai_1.expect(setPreference.args[1][1]).to.equal(Collection_1.default.GRID_VIEW);
        });
    });
    describe("collection with facetGroups", function () {
        var collectionData, wrapper;
        beforeEach(function () {
            var context = routing_1.mockRouterContext();
            collectionData = {
                id: "test collection",
                url: "test url",
                title: "title",
                books: [],
                lanes: [],
                navigationLinks: [],
                facetGroups: [
                    {
                        label: "group",
                        facets: []
                    }
                ]
            };
            wrapper = enzyme_1.mount(React.createElement(Collection_1.default, { collection: collectionData, updateBook: updateBook, fulfillBook: fulfillBook, indirectFulfillBook: indirectFulfillBook, setPreference: setPreference }), {
                context: context,
                childContextTypes: {
                    router: PropTypes.object,
                    pathFor: PropTypes.func
                }
            });
        });
        it("shows facet groups", function () {
            var facetGroups = wrapper.find(FacetGroup_1.default);
            var facetGroupDatas = facetGroups.map(function (group) { return group.props().facetGroup; });
            chai_1.expect(facetGroups.length).to.equal(1);
            chai_1.expect(facetGroupDatas).to.deep.equal(collectionData.facetGroups);
        });
        it("shows skip navigation link for facet groups", function () {
            var links = wrapper.find(SkipNavigationLink_1.default);
            chai_1.expect(links.length).to.equal(1);
        });
    });
    describe("collection with navigation links", function () {
        var collectionData, wrapper;
        beforeEach(function () {
            var context = routing_1.mockRouterContext();
            collectionData = {
                id: "test collection",
                url: "test url",
                title: "title",
                books: [],
                lanes: [],
                navigationLinks: [
                    { text: "link 1", url: "url 1" },
                    { text: "link 2", url: "url 2" }
                ],
                facetGroups: [
                    {
                        label: "group",
                        facets: []
                    }
                ]
            };
            wrapper = enzyme_1.mount(React.createElement(Collection_1.default, { collection: collectionData, updateBook: updateBook, fulfillBook: fulfillBook, indirectFulfillBook: indirectFulfillBook, setPreference: setPreference }), {
                context: context,
                childContextTypes: {
                    router: PropTypes.object,
                    pathFor: PropTypes.func
                }
            });
        });
        it("renders a navigation links nav", function () {
            var nav = wrapper.find("nav");
            var links = wrapper.find("li");
            chai_1.expect(nav.prop("role")).to.equal("navigation");
            chai_1.expect(nav.prop("aria-label")).to.equal("navigation links");
            chai_1.expect(links.length).to.equal(2);
        });
    });
    describe("collection with next page", function () {
        /**
         * Need to mock the scrollHeight and clientHeight because it
         * is not settable in jsdom
         */
        Object.defineProperty(HTMLElement.prototype, "scrollHeight", {
            configurable: true,
            get: function () {
                return this._scrollHeight || 0;
            },
            set: function (val) {
                this._scrollHeight = val;
            }
        });
        Object.defineProperty(HTMLElement.prototype, "clientHeight", {
            configurable: true,
            get: function () {
                return this._clientHeight || 0;
            },
            set: function (val) {
                this._clientHeight = val;
            }
        });
        var pause = function (ms) {
            if (ms === void 0) { ms = 0; }
            return new Promise(function (resolve) { return setTimeout(resolve, ms); });
        };
        it("fetches next page on scroll to bottom", function () { return __awaiter(void 0, void 0, void 0, function () {
            var fetchPage, collectionData, context, wrapper, main;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fetchPage = sinon_1.stub();
                        collectionData = {
                            id: "test collection",
                            url: "test url",
                            title: "title",
                            books: [],
                            lanes: [],
                            navigationLinks: [],
                            nextPageUrl: "next"
                        };
                        context = routing_1.mockRouterContext();
                        wrapper = enzyme_1.mount(React.createElement(Collection_1.default, { collection: collectionData, fetchPage: fetchPage, updateBook: updateBook, fulfillBook: fulfillBook, indirectFulfillBook: indirectFulfillBook, setPreference: setPreference }), {
                            context: context,
                            childContextTypes: {
                                router: PropTypes.object,
                                pathFor: PropTypes.func
                            }
                        });
                        main = wrapper.instance().refs["collection-main"];
                        main.scrollTop = 1000;
                        main.scrollHeight = 1;
                        main.clientHeight = 1;
                        wrapper.instance().handleScrollOrResize();
                        return [4 /*yield*/, pause(51)];
                    case 1:
                        _a.sent();
                        chai_1.expect(fetchPage.callCount).to.equal(1);
                        chai_1.expect(fetchPage.args[0][0]).to.equal("next");
                        return [2 /*return*/];
                }
            });
        }); });
        it("fetches next page if first page doesn't fill window", function () { return __awaiter(void 0, void 0, void 0, function () {
            var fetchPage, collectionData, context, wrapper, main;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fetchPage = sinon_1.stub();
                        collectionData = {
                            id: "test collection",
                            url: "test url",
                            title: "title",
                            books: [],
                            lanes: [],
                            navigationLinks: [],
                            nextPageUrl: "next"
                        };
                        context = routing_1.mockRouterContext();
                        wrapper = enzyme_1.mount(React.createElement(Collection_1.default, { collection: collectionData, fetchPage: fetchPage, updateBook: updateBook, fulfillBook: fulfillBook, indirectFulfillBook: indirectFulfillBook, setPreference: setPreference }), { context: context });
                        main = wrapper.instance().refs["collection-main"];
                        main.scrollTop = 1000;
                        main.scrollHeight = 1;
                        main.clientHeight = 1;
                        wrapper.mount();
                        return [4 /*yield*/, pause(51)];
                    case 1:
                        _a.sent();
                        chai_1.expect(fetchPage.callCount).to.equal(1);
                        chai_1.expect(fetchPage.args[0][0]).to.equal("next");
                        return [2 /*return*/];
                }
            });
        }); });
        it("fetches next page if newly loaded page doesn't fill window", function () { return __awaiter(void 0, void 0, void 0, function () {
            var fetchPage, collectionData, context, wrapper, main;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fetchPage = sinon_1.stub();
                        collectionData = {
                            id: "test collection",
                            url: "test url",
                            title: "title",
                            books: [],
                            lanes: [],
                            navigationLinks: [],
                            nextPageUrl: "next"
                        };
                        context = routing_1.mockRouterContext();
                        wrapper = enzyme_1.mount(React.createElement(Collection_1.default, { collection: collectionData, fetchPage: fetchPage, updateBook: updateBook, fulfillBook: fulfillBook, indirectFulfillBook: indirectFulfillBook, setPreference: setPreference }), { context: context });
                        main = wrapper.instance().refs["collection-main"];
                        main.scrollTop = 1;
                        main.scrollHeight = 100;
                        main.clientHeight = 1000;
                        wrapper.mount();
                        return [4 /*yield*/, pause(51)];
                    case 1:
                        _a.sent();
                        chai_1.expect(fetchPage.callCount).to.equal(1);
                        chai_1.expect(fetchPage.args[0][0]).to.equal("next");
                        wrapper.setProps({ isFetchingCollection: false });
                        return [4 /*yield*/, pause(51)];
                    case 2:
                        _a.sent();
                        // body's scroll attributes haven't changed
                        chai_1.expect(fetchPage.callCount).to.equal(2);
                        chai_1.expect(fetchPage.args[1][0]).to.equal("next");
                        return [2 /*return*/];
                }
            });
        }); });
        it("shows loading indicator for next page", function () {
            var collectionData = {
                id: "test collection",
                url: "test url",
                title: "title",
                books: [],
                lanes: [],
                navigationLinks: []
            };
            var wrapper = enzyme_1.mount(React.createElement(Collection_1.default, { collection: collectionData, isFetchingPage: true, updateBook: updateBook, fulfillBook: fulfillBook, indirectFulfillBook: indirectFulfillBook, setPreference: setPreference }));
            var loadings = wrapper.find(".loading-next-page");
            chai_1.expect(loadings.length).to.equal(1);
        });
        it("contains next page button", function () {
            var fetchPage = sinon_1.stub();
            var collectionData = Object.assign({}, collectionData_1.ungroupedCollectionData, {
                nextPageUrl: "next page url"
            });
            var context = routing_1.mockRouterContext();
            var wrapper = enzyme_1.mount(React.createElement(Collection_1.default, { collection: collectionData, isFetchingPage: false, fetchPage: fetchPage, updateBook: updateBook, fulfillBook: fulfillBook, indirectFulfillBook: indirectFulfillBook, setPreference: setPreference }), {
                context: context,
                childContextTypes: {
                    router: PropTypes.object,
                    pathFor: PropTypes.func
                }
            });
            var link = wrapper.find(".next-page-link");
            chai_1.expect(link.text()).to.equal("Load more books");
        });
    });
    describe("collection that scrolls", function () {
        var collectionData = {
            id: "test collection",
            url: "test url",
            title: "title",
            books: [],
            lanes: [],
            navigationLinks: []
        };
        var wrapper;
        var context;
        var main;
        beforeEach(function () {
            context = routing_1.mockRouterContext();
            wrapper = enzyme_1.mount(React.createElement(Collection_1.default, { collection: collectionData, isFetchingCollection: true, updateBook: updateBook, fulfillBook: fulfillBook, indirectFulfillBook: indirectFulfillBook, setPreference: setPreference }), { context: context });
            main = wrapper.instance().refs["collection-main"];
            main.scrollTop = 1000;
            main.scrollHeight = 1;
            main.clientHeight = 1;
        });
        it("scrolls to top when new collection fetched successfully", function () {
            wrapper.setProps({ isFetchingCollection: false });
            chai_1.expect(main.scrollTop).to.equal(0);
        });
        it("does not scroll when there's an error", function () {
            var error = {
                status: 500,
                response: "error",
                url: "url"
            };
            wrapper = enzyme_1.mount(React.createElement(Collection_1.default, { collection: collectionData, isFetchingCollection: false, error: error, updateBook: updateBook, fulfillBook: fulfillBook, indirectFulfillBook: indirectFulfillBook, setPreference: setPreference }), { context: context });
            chai_1.expect(main.scrollTop).to.equal(1000);
        });
    });
});
