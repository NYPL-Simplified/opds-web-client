"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var React = require("react");
var enzyme_1 = require("enzyme");
var CatalogLink_1 = require("../CatalogLink");
var react_router_1 = require("react-router");
var routing_1 = require("./routing");
describe("CatalogLink", function () {
    it("renders Link with location and props and context", function () {
        var props = {
            className: "test-class",
            id: "test-id",
            target: "_blank",
            collectionUrl: "test collection",
            bookUrl: "test book"
        };
        var context = routing_1.mockRouterContext();
        var location = context.pathFor(props.collectionUrl, props.bookUrl);
        var linkProps = Object.assign({}, react_router_1.Link.defaultProps, props, { to: location });
        delete linkProps["collectionUrl"];
        delete linkProps["bookUrl"];
        var requiredRouterKeys = [
            "push", "createHref", "isActive", "replace",
            "go", "goBack", "goForward", "setRouteLeaveHook"
        ];
        var wrapper = enzyme_1.shallow(React.createElement(CatalogLink_1.default, __assign({}, props)), { context: context });
        var link = wrapper.find(react_router_1.Link);
        var instance = wrapper.instance();
        var linkContextRouterKeys = Object.keys(instance.getChildContext().router);
        chai_1.expect(link.props()).to.deep.equal(linkProps);
        chai_1.expect(linkContextRouterKeys).to.deep.equal(requiredRouterKeys);
    });
    it("passes children to Link", function () {
        var props = {
            className: "test-class",
            id: "test-id",
            target: "_blank",
            collectionUrl: "test collection",
            bookUrl: "test book"
        };
        var context = routing_1.mockRouterContext();
        var wrapper = enzyme_1.shallow(React.createElement(CatalogLink_1.default, __assign({}, props),
            React.createElement("div", { className: "child" })), { context: context });
        var child = wrapper.children().first();
        chai_1.expect(child.hasClass("child")).to.equal(true);
    });
});
