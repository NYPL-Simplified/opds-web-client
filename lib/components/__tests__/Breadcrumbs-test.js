"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var React = require("react");
var enzyme_1 = require("enzyme");
var Breadcrumbs_1 = require("../Breadcrumbs");
var CatalogLink_1 = require("../CatalogLink");
describe("Breadcrumbs", function () {
    var data;
    beforeEach(function () {
        data = [
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
    });
    it("should render a role of type navigation", function () {
        var wrapper = enzyme_1.shallow(React.createElement(Breadcrumbs_1.default, { links: data }));
        var nav = wrapper.find("nav");
        chai_1.expect(nav.prop("role")).to.equal("navigation");
        chai_1.expect(nav.prop("aria-label")).to.equal("breadcrumbs");
    });
    it("shows links with bootstrap classes", function () {
        var wrapper = enzyme_1.shallow(React.createElement(Breadcrumbs_1.default, { links: data }));
        var list = wrapper.find("ol");
        var links = wrapper.find(CatalogLink_1.default);
        var currentLink = wrapper.find("ol li").last();
        chai_1.expect(list.hasClass("breadcrumbs")).to.equal(true);
        // The current page is no longer a link unless `currentLink` is true:
        chai_1.expect(links.length).to.equal(1);
        chai_1.expect(links.at(0).props().children).to.contain("2nd title");
        chai_1.expect(links.at(0).props().collectionUrl).to.equal("2nd url");
        // last link is wrapped in <span>
        chai_1.expect(currentLink.text()).to.equal("last title");
    });
    it("should render all the data as links since the currentLink prop is true", function () {
        var wrapper = enzyme_1.shallow(React.createElement(Breadcrumbs_1.default, { links: data, currentLink: true }));
        var list = wrapper.find("ol");
        var links = wrapper.find(CatalogLink_1.default);
        chai_1.expect(list.hasClass("breadcrumbs")).to.equal(true);
        chai_1.expect(links.length).to.equal(2);
        chai_1.expect(links.at(0).props().children).to.contain("2nd title");
        chai_1.expect(links.at(0).props().collectionUrl).to.equal("2nd url");
        chai_1.expect(links.at(1).props().children).to.contain("last title");
        chai_1.expect(links.at(1).props().collectionUrl).to.equal("last url");
    });
});
describe("hierarchyComputeBreadcrumbs", function () {
    var collection = {
        id: "new id",
        url: "new url",
        title: "new title",
        lanes: [],
        books: [],
        navigationLinks: []
    };
    var collectionLink = {
        url: "new url",
        text: "new title"
    };
    var history = [];
    it("returns only collection link without root or parent", function () {
        chai_1.expect(Breadcrumbs_1.hierarchyComputeBreadcrumbs(collection, history)).to.deep.equal([
            collectionLink
        ]);
    });
    it("returns root and collection if parent not present", function () {
        var catalogRootLink = {
            url: "new root url",
            text: "new root url"
        };
        var data = Object.assign({}, collection, { catalogRootLink: catalogRootLink });
        chai_1.expect(Breadcrumbs_1.hierarchyComputeBreadcrumbs(data, history)).to.deep.equal([
            catalogRootLink,
            collectionLink
        ]);
    });
    it("provides default catalog root title", function () {
        var catalogRootLink = {
            url: "new root url",
            text: null
        };
        var data = Object.assign({}, collection, { catalogRootLink: catalogRootLink });
        chai_1.expect(Breadcrumbs_1.hierarchyComputeBreadcrumbs(data, history)).to.deep.equal([
            {
                url: catalogRootLink.url,
                text: "Catalog"
            },
            collectionLink
        ]);
    });
    it("returns only parent and collection if root not present", function () {
        var parentLink = {
            url: "new parent url",
            text: "new parent text"
        };
        var data = Object.assign({}, collection, { parentLink: parentLink });
        chai_1.expect(Breadcrumbs_1.hierarchyComputeBreadcrumbs(data, history)).to.deep.equal([
            parentLink,
            collectionLink
        ]);
    });
    it("returns only root and collection if parent is same as root", function () {
        var catalogRootLink = {
            url: "new root url",
            text: "new root text"
        };
        var parentLink = {
            url: "new root url",
            text: "new root text"
        };
        var data = Object.assign({}, collection, { catalogRootLink: catalogRootLink, parentLink: parentLink });
        chai_1.expect(Breadcrumbs_1.hierarchyComputeBreadcrumbs(data, history)).to.deep.equal([
            catalogRootLink,
            collectionLink
        ]);
    });
    it("return only parent and collection if collection is same as root", function () {
        var catalogRootLink = {
            url: "new url",
            text: "new title"
        };
        var parentLink = {
            url: "new parent url",
            text: "new parent text"
        };
        var data = Object.assign({}, collection, { catalogRootLink: catalogRootLink, parentLink: parentLink });
        chai_1.expect(Breadcrumbs_1.hierarchyComputeBreadcrumbs(data, history)).to.deep.equal([
            parentLink,
            collectionLink
        ]);
    });
    it("return only root and parent if collection is same as parent", function () {
        var catalogRootLink = {
            url: "new root url",
            text: "new root text"
        };
        var parentLink = {
            url: "new url",
            text: "new title"
        };
        var data = Object.assign({}, collection, { catalogRootLink: catalogRootLink, parentLink: parentLink });
        chai_1.expect(Breadcrumbs_1.hierarchyComputeBreadcrumbs(data, history)).to.deep.equal([
            catalogRootLink,
            parentLink
        ]);
    });
    it("uses a custom comparator if passed one", function () {
        var catalogRootLink = {
            url: "new root url",
            text: "new root text"
        };
        var data = Object.assign({}, collection, { catalogRootLink: catalogRootLink });
        // no comparator
        chai_1.expect(Breadcrumbs_1.hierarchyComputeBreadcrumbs(data, history)).to.deep.equal([
            catalogRootLink,
            collectionLink
        ]);
        // comparator that says links are equal
        var comparator = function (url1, url2) { return true; };
        chai_1.expect(Breadcrumbs_1.hierarchyComputeBreadcrumbs(data, history, comparator)).to.deep.equal([collectionLink]);
        // comparator that says links are not equal
        comparator = function (url1, url2) { return false; };
        chai_1.expect(Breadcrumbs_1.hierarchyComputeBreadcrumbs(data, history, comparator)).to.deep.equal([catalogRootLink, collectionLink]);
    });
});
