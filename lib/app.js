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
var React = require("react");
var ReactDOM = require("react-dom");
var PropTypes = require("prop-types");
var react_router_1 = require("react-router");
var OPDSCatalog_1 = require("./components/OPDSCatalog");
require("./stylesheets/app.scss");
var PathForContext_1 = require("./components/context/PathForContext");
var ActionsContext_1 = require("./components/context/ActionsContext");
var OPDSDataAdapter_1 = require("./OPDSDataAdapter");
var DataFetcher_1 = require("./DataFetcher");
var actions_1 = require("./actions");
var OPDSCatalogRouterHandler = function (config) {
    var OPDSCatalogRoute = /** @class */ (function (_super) {
        __extends(OPDSCatalogRoute, _super);
        function OPDSCatalogRoute() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OPDSCatalogRoute.prototype.render = function () {
            var _a;
            var _b = (_a = this.props.params, (_a !== null && _a !== void 0 ? _a : {})), collectionUrl = _b.collectionUrl, bookUrl = _b.bookUrl;
            var mergedProps = __assign(__assign({}, config), { collectionUrl: collectionUrl,
                bookUrl: bookUrl });
            var fetcher = new DataFetcher_1.default({ adapter: OPDSDataAdapter_1.adapter, proxyUrl: config.proxyUrl });
            var actions = new actions_1.default(fetcher);
            return (React.createElement(PathForContext_1.default, { pathFor: config.pathFor },
                React.createElement(ActionsContext_1.ActionsProvider, { actions: actions, fetcher: fetcher },
                    React.createElement(OPDSCatalog_1.default, __assign({}, mergedProps)))));
        };
        OPDSCatalogRoute.contextTypes = {
            router: PropTypes.object.isRequired
        };
        return OPDSCatalogRoute;
    }(React.Component));
    return OPDSCatalogRoute;
};
/** Standalone app to be mounted in an existing DOM element. */
var OPDSWebClient = /** @class */ (function () {
    function OPDSWebClient(config, elementId) {
        this.elementId = elementId;
        this.pathPattern =
            config.pathPattern || "/(collection/:collectionUrl/)(book/:bookUrl/)";
        this.RouteHandler = OPDSCatalogRouterHandler(config);
        this.render();
    }
    OPDSWebClient.prototype.render = function () {
        var RouteHandler = this.RouteHandler;
        // `react-axe` should only run in development and testing mode.
        // Running this is resource intensive and should only be used to test
        // for accessibility and not during active development.
        if (process.env.TEST_AXE === "true") {
            var axe = require("react-axe");
            axe(React, ReactDOM, 1000);
        }
        ReactDOM.render(React.createElement(react_router_1.Router, { history: react_router_1.browserHistory },
            React.createElement(react_router_1.Route, { path: this.pathPattern, component: RouteHandler })), document.getElementById(this.elementId));
    };
    return OPDSWebClient;
}());
module.exports = OPDSWebClient;
