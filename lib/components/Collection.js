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
var throttle_debounce_1 = require("throttle-debounce");
var Book_1 = require("./Book");
var CatalogLink_1 = require("./CatalogLink");
var Lanes_1 = require("./Lanes");
var FacetGroup_1 = require("./FacetGroup");
var SkipNavigationLink_1 = require("./SkipNavigationLink");
/** Displays books in an OPDS collection as either lanes, a grid or a list. */
var Collection = /** @class */ (function (_super) {
    __extends(Collection, _super);
    function Collection(props) {
        var _this = _super.call(this, props) || this;
        _this.fetch = _this.fetch.bind(_this);
        _this.handleScrollOrResize = throttle_debounce_1.debounce(50, _this.handleScrollOrResize.bind(_this));
        _this.getSelectedView = _this.getSelectedView.bind(_this);
        _this.selectGridView = _this.selectGridView.bind(_this);
        _this.selectListView = _this.selectListView.bind(_this);
        return _this;
    }
    Collection.prototype.render = function () {
        var _this = this;
        var _a;
        var hasFacets = this.props.collection.facetGroups &&
            this.props.collection.facetGroups.length > 0;
        var hasViews = this.props.collection.books && this.props.collection.books.length > 0;
        return (React.createElement("div", { className: "collection" },
            hasFacets && (React.createElement("div", { className: "facet-groups", "aria-label": "filters" },
                React.createElement(SkipNavigationLink_1.default, { target: "#collection-main", label: "filters" }), (_a = this.props.collection.facetGroups) === null || _a === void 0 ? void 0 :
                _a.map(function (facetGroup) { return (React.createElement(FacetGroup_1.default, { key: facetGroup.label, facetGroup: facetGroup })); }))),
            React.createElement("div", { className: "collection-container" },
                hasViews && (React.createElement("div", { className: "view-toggle" },
                    React.createElement("button", { title: "Select grid view", disabled: this.getSelectedView() === Collection.GRID_VIEW, onClick: this.selectGridView },
                        React.createElement("i", { className: "fa fa-th-large" })),
                    React.createElement("button", { title: "Select list view", disabled: this.getSelectedView() === Collection.LIST_VIEW, onClick: this.selectListView },
                        React.createElement("i", { className: "fa fa-th-list" })))),
                React.createElement("div", { id: "collection-main", className: "collection-main", ref: "collection-main", "aria-label": "books in " + this.props.collection.title },
                    this.props.collection.lanes &&
                        this.props.collection.lanes.length > 0 ? (React.createElement(Lanes_1.Lanes, { url: this.props.collection.url, lanes: this.props.collection.lanes, updateBook: this.props.updateBook, isSignedIn: this.props.isSignedIn, epubReaderUrlTemplate: this.props.epubReaderUrlTemplate })) : null,
                    this.props.collection.books && (React.createElement("ul", { "aria-label": "books", className: "subtle-list books " + this.getSelectedView() }, this.props.collection.books.map(function (book, index) { return (React.createElement("li", { key: index },
                        React.createElement(Book_1.default, { book: book, collectionUrl: _this.props.collection.url, updateBook: _this.props.updateBook, isSignedIn: _this.props.isSignedIn, epubReaderUrlTemplate: _this.props.epubReaderUrlTemplate }))); }))),
                    this.props.collection.navigationLinks && (React.createElement("nav", { role: "navigation", "aria-label": "navigation links" },
                        React.createElement("ul", { className: "navigation-links subtle-list" }, this.props.collection.navigationLinks.map(function (link, index) { return (React.createElement("li", { key: index },
                            React.createElement(CatalogLink_1.default, { collectionUrl: link.url }, link.text))); })))),
                    this.isEmpty() && (React.createElement("div", { className: "empty-collection-message" }, "No books found.")),
                    this.canFetch() && (React.createElement("button", { className: "next-page-link visually-hidden", onClick: this.fetch }, "Load more books")),
                    this.props.isFetchingPage && (React.createElement("div", { className: "loading-next-page" },
                        React.createElement("h3", null, "Loading more books...")))))));
    };
    Collection.prototype.getSelectedView = function () {
        return ((this.props.preferences && this.props.preferences[Collection.VIEW_KEY]) ||
            Collection.GRID_VIEW);
    };
    Collection.prototype.selectGridView = function () {
        if (this.props.setPreference) {
            this.props.setPreference(Collection.VIEW_KEY, Collection.GRID_VIEW);
        }
    };
    Collection.prototype.selectListView = function () {
        if (this.props.setPreference) {
            this.props.setPreference(Collection.VIEW_KEY, Collection.LIST_VIEW);
        }
    };
    Collection.prototype.componentWillReceiveProps = function (nextProps) {
        if (this.props.isFetchingCollection &&
            !nextProps.isFetchingCollection &&
            !nextProps.error) {
            this.refs["collection-main"].scrollTop = 0;
        }
        // the component might be loading a new collection that doesn't fill the page
        this.handleScrollOrResize();
    };
    Collection.prototype.componentDidMount = function () {
        var body = this.refs["collection-main"];
        body.addEventListener("scroll", this.handleScrollOrResize);
        window.addEventListener("resize", this.handleScrollOrResize);
        // the first page might not fill the screen on initial load, so run handler once
        this.handleScrollOrResize();
    };
    Collection.prototype.componentWillUnmount = function () {
        var body = this.refs["collection-main"];
        body.removeEventListener("scroll", this.handleScrollOrResize);
        window.removeEventListener("resize", this.handleScrollOrResize);
    };
    Collection.prototype.canFetch = function () {
        return (!this.props.hidden &&
            !this.props.isFetchingPage &&
            !!this.props.collection.nextPageUrl);
    };
    Collection.prototype.fetch = function () {
        var _a, _b;
        // had to move this typeguard into here for typescript to
        // believe the nextPageUrl was defined.
        if (this.canFetch() && this.props.collection.nextPageUrl) {
            (_b = (_a = this.props).fetchPage) === null || _b === void 0 ? void 0 : _b.call(_a, this.props.collection.nextPageUrl);
        }
    };
    Collection.prototype.handleScrollOrResize = function () {
        var main = this.refs["collection-main"];
        if (main) {
            var scrollTop = main.scrollTop;
            var scrollHeight = main.scrollHeight;
            var clientHeight = main.clientHeight;
            if (scrollTop + clientHeight >= scrollHeight) {
                this.fetch();
            }
        }
    };
    Collection.prototype.isEmpty = function () {
        return (this.props.collection.lanes.length === 0 &&
            this.props.collection.books.length === 0 &&
            this.props.collection.navigationLinks.length === 0);
    };
    Collection.VIEW_KEY = "collection-view";
    Collection.GRID_VIEW = "grid-view";
    Collection.LIST_VIEW = "list-view";
    return Collection;
}(React.Component));
exports.default = Collection;
