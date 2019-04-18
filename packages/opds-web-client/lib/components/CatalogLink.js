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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var prop_types_1 = require("prop-types");
var react_router_1 = require("react-router");
/** Shows a link to another collection or book in the same OPDS catalog. */
var CatalogLink = /** @class */ (function (_super) {
    __extends(CatalogLink, _super);
    function CatalogLink() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // provides full router context expected by but not actually used by Link
    // see https://github.com/reactjs/react-router/blob/master/docs/API.md#contextrouter
    // and https://github.com/reactjs/react-router/blob/master/modules/PropTypes.js
    CatalogLink.prototype.getChildContext = function () {
        var noop = function () { };
        var router = Object.assign({}, this.context.router, {
            replace: noop,
            go: noop,
            goBack: noop,
            goForward: noop,
            setRouteLeaveHook: noop,
        });
        return { router: router };
    };
    ;
    CatalogLink.prototype.render = function () {
        var _a = this.props, collectionUrl = _a.collectionUrl, bookUrl = _a.bookUrl, rest = __rest(_a, ["collectionUrl", "bookUrl"]);
        collectionUrl = collectionUrl || null;
        bookUrl = bookUrl || null;
        var location = this.context.pathFor(collectionUrl, bookUrl);
        // `rest` contains only the props that are needed by `Link`
        var props = Object.assign({}, rest);
        return (React.createElement(react_router_1.Link, __assign({ to: location }, props)));
    };
    CatalogLink.contextTypes = {
        router: prop_types_1.PropTypes.object.isRequired,
        pathFor: prop_types_1.PropTypes.func.isRequired
    };
    CatalogLink.childContextTypes = {
        router: prop_types_1.PropTypes.object.isRequired
    };
    return CatalogLink;
}(React.Component));
exports.default = CatalogLink;
