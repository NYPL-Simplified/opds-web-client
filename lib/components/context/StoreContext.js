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
var react_redux_1 = require("react-redux");
var store_1 = require("../../store");
var PathForContext_1 = require("./PathForContext");
var BasicAuthPlugin_1 = require("../../BasicAuthPlugin");
/**
 * Builds the redux store and makes it available in context via new API.
 * takes in the pathFor context. Will be used by OPDSCatalog
 * as well as circulation-patron-web.
 */
var OPDSStore = /** @class */ (function (_super) {
    __extends(OPDSStore, _super);
    function OPDSStore(props, pathFor) {
        var _a;
        var _this = _super.call(this, props) || this;
        _this.store = (_a = props.store, (_a !== null && _a !== void 0 ? _a : store_1.default(_this.props.initialState || undefined, _this.props.authPlugins || [BasicAuthPlugin_1.default], pathFor)));
        return _this;
    }
    OPDSStore.prototype.render = function () {
        return React.createElement(react_redux_1.Provider, { store: this.store }, this.props.children);
    };
    OPDSStore.contextType = PathForContext_1.PathForContext;
    return OPDSStore;
}(React.Component));
exports.default = OPDSStore;
exports.ReduxContext = react_redux_1.ReactReduxContext;
