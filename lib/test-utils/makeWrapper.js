"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var sinon_1 = require("sinon");
var PathForContext_1 = require("../components/context/PathForContext");
var ActionsContext_1 = require("../components/context/ActionsContext");
var StoreContext_1 = require("../components/context/StoreContext");
var actions_1 = require("../actions");
var DataFetcher_1 = require("../DataFetcher");
var OPDSDataAdapter_1 = require("../OPDSDataAdapter");
var store_1 = require("../store");
var BasicAuthPlugin_1 = require("../BasicAuthPlugin");
var defaultPathFor = sinon_1.fake(function (collectionUrl, bookUrl) {
    return "/" + collectionUrl + bookUrl ? "/" + bookUrl : "";
});
var makeWrapper = function (config) {
    if (config === void 0) { config = {}; }
    var _a = config.pathFor, pathFor = _a === void 0 ? defaultPathFor : _a, proxyUrl = config.proxyUrl, initialState = config.initialState, authPlugins = config.authPlugins;
    var fetcher = new DataFetcher_1.default({ adapter: OPDSDataAdapter_1.adapter, proxyUrl: proxyUrl });
    var actions = new actions_1.default(fetcher);
    var store = store_1.default(initialState || undefined, authPlugins || [BasicAuthPlugin_1.default], pathFor);
    return {
        store: store,
        actions: actions,
        fetcher: fetcher,
        wrapper: function (_a) {
            var children = _a.children;
            return (React.createElement(PathForContext_1.default, { pathFor: pathFor },
                React.createElement(ActionsContext_1.ActionsProvider, { actions: actions, fetcher: fetcher },
                    React.createElement(StoreContext_1.default, { store: store }, children))));
        }
    };
};
exports.default = makeWrapper;
