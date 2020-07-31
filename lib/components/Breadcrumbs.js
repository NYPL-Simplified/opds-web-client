"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var CatalogLink_1 = require("./CatalogLink");
/**
 * Shows a list of breadcrumbs links above a collection.
 **/
var Breadcrumbs = function (_a) {
    var links = _a.links, _b = _a.currentLink, currentLink = _b === void 0 ? false : _b;
    return (React.createElement("nav", { "aria-label": "breadcrumbs", role: "navigation" },
        React.createElement("ol", { className: "breadcrumbs" }, links &&
            links.map(function (link, i) { return (React.createElement("li", { key: link.url, className: "breadcrumb" }, i === links.length - 1 && !currentLink ? (React.createElement("span", null, link.text)) : (React.createElement(CatalogLink_1.default, { collectionUrl: link.url, bookUrl: null }, link.text)))); }))));
};
exports.default = Breadcrumbs;
/**
 * Computes breadcrumbs based on the browser history, with the current
 * collection as the final element.
 **/
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
/**
 * Computes breadcrumbs assuming that the OPDS feed is hierarchical - uses
 * the catalog root link, the parent of the current collection if it's not
 * the root, and the current collection. The OPDS spec doesn't require a
 * hierarchy, so this may not make sense for some feeds.
 * */
function hierarchyComputeBreadcrumbs(collection, history, comparator) {
    var links = [];
    if (!collection) {
        return [];
    }
    if (!comparator) {
        comparator = function (url1, url2) { return url1 === url2; };
    }
    var catalogRootLink = collection.catalogRootLink, parentLink = collection.parentLink;
    if (catalogRootLink && !comparator(catalogRootLink.url, collection.url)) {
        links.push({
            text: catalogRootLink.text || "Catalog",
            url: catalogRootLink.url
        });
    }
    if (parentLink &&
        parentLink.url &&
        parentLink.text &&
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
