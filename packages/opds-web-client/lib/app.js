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
var React = require("react");
var ReactDOM = require("react-dom");
var prop_types_1 = require("prop-types");
var createReactClass = require("create-react-class");
var react_router_1 = require("react-router");
var OPDSCatalog_1 = require("./components/OPDSCatalog");
require("./stylesheets/app.scss");
var OPDSCatalogRouterHandler = function (config) {
    var OPDSCatalogRoute = /** @class */ (function (_super) {
        __extends(OPDSCatalogRoute, _super);
        function OPDSCatalogRoute() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OPDSCatalogRoute.prototype.getChildContext = function () {
            return {
                pathFor: config.pathFor,
            };
        };
        OPDSCatalogRoute.prototype.render = function () {
            var _a = this.props.params, collectionUrl = _a.collectionUrl, bookUrl = _a.bookUrl;
            var mergedProps = Object.assign(config, {
                collectionUrl: collectionUrl,
                bookUrl: bookUrl
            });
            return React.createElement(OPDSCatalog_1.default, __assign({}, mergedProps));
        };
        ;
        OPDSCatalogRoute.childContextTypes = {
            pathFor: prop_types_1.PropTypes.func.isRequired
        };
        return OPDSCatalogRoute;
    }(React.Component));
    return OPDSCatalogRoute;
};
/** Standalone app to be mounted in an existing DOM element. */
var OPDSWebClient = /** @class */ (function () {
    function OPDSWebClient(config, elementId) {
        this.elementId = elementId;
        this.pathPattern = config.pathPattern || "/(collection/:collectionUrl/)(book/:bookUrl/)";
        this.RouteHandler = OPDSCatalogRouterHandler(config);
        this.render();
    }
    OPDSWebClient.prototype.render = function () {
        var RouteHandler = this.RouteHandler;
        ReactDOM.render(React.createElement(react_router_1.Router, { history: react_router_1.browserHistory },
            React.createElement(react_router_1.Route, { path: this.pathPattern, component: RouteHandler })), document.getElementById(this.elementId));
    };
    return OPDSWebClient;
}());
module.exports = OPDSWebClient;
