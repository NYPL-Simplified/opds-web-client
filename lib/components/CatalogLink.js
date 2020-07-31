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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var PropTypes = require("prop-types");
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
            setRouteLeaveHook: noop
        });
        return { router: router };
    };
    CatalogLink.prototype.render = function () {
        var _a = this.props, _b = _a.collectionUrl, collectionUrl = _b === void 0 ? null : _b, _c = _a.bookUrl, bookUrl = _c === void 0 ? null : _c, props = __rest(_a, ["collectionUrl", "bookUrl"]);
        var location = this.context.pathFor(collectionUrl, bookUrl);
        return React.createElement(react_router_1.Link, __assign({ to: location }, props));
    };
    CatalogLink.contextTypes = {
        router: PropTypes.object.isRequired,
        pathFor: PropTypes.func.isRequired
    };
    CatalogLink.childContextTypes = {
        router: PropTypes.object.isRequired
    };
    return CatalogLink;
}(React.Component));
exports.default = CatalogLink;
