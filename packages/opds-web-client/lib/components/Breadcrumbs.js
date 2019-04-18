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
var CatalogLink_1 = require("./CatalogLink");
/** Shows a list of breadcrumbs links above a collection. */
var Breadcrumbs = /** @class */ (function (_super) {
    __extends(Breadcrumbs, _super);
    function Breadcrumbs() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Breadcrumbs.prototype.render = function () {
        var _this = this;
        return (React.createElement("ol", { className: "breadcrumb", "aria-label": "breadcrumbs", role: "navigation" }, this.props.links && this.props.links.map(function (link, i) {
            return React.createElement("li", { key: link.url }, (i === _this.props.links.length - 1) && (!_this.props.currentLink) ?
                React.createElement("span", null, link.text) :
                React.createElement(CatalogLink_1.default, { collectionUrl: link.url, bookUrl: null }, link.text));
        })));
    };
    Breadcrumbs.defaultProps = {
        currentLink: false,
    };
    return Breadcrumbs;
}(React.Component));
exports.default = Breadcrumbs;
/** Computes breadcrumbs based on the browser history, with the current collection as the
    final element. */
function defaultComputeBreadcrumbs(collection, history) {
    var links = history ? history.slice(0) : [];
    if (collection) {
        links.push({
            url: collection.url,
            text: collection.title
        });
    }
    return links;
}
exports.defaultComputeBreadcrumbs = defaultComputeBreadcrumbs;
/** Computes breadcrumbs assuming that the OPDS feed is hierarchical - uses the catalog root
    link, the parent of the current collection if it's not the root, and the current collection.
    The OPDS spec doesn't require a hierarchy, so this may not make sense for some feeds. */
function hierarchyComputeBreadcrumbs(collection, history, comparator) {
    var links = [];
    if (!collection) {
        return [];
    }
    if (!comparator) {
        comparator = function (url1, url2) { return (url1 === url2); };
    }
    var catalogRootLink = collection.catalogRootLink, parentLink = collection.parentLink;
    if (catalogRootLink && !comparator(catalogRootLink.url, collection.url)) {
        links.push({
            text: catalogRootLink.text || "Catalog",
            url: catalogRootLink.url
        });
    }
    if (parentLink && parentLink.url && parentLink.text &&
        (!catalogRootLink || !comparator(parentLink.url, catalogRootLink.url)) &&
        !comparator(parentLink.url, collection.url)) {
        links.push({
            text: parentLink.text,
            url: parentLink.url
        });
    }
    links.push({
        url: collection.url,
        text: collection.title
    });
    return links;
}
exports.hierarchyComputeBreadcrumbs = hierarchyComputeBreadcrumbs;
;
