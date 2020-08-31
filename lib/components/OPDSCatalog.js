"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_redux_1 = require("react-redux");
var Root_1 = require("./Root");
var StoreContext_1 = require("./context/StoreContext");
/**
 * The main application component.
 *  - Renders root and passes props along with store to root
 *  - Creates the redux store using OPDSStore
 *  - Consumes and passes it down
 *  - Passes the redux store down the tree in context
 */
var OPDSCatalog = function (props) {
    return (React.createElement(StoreContext_1.default, { initialState: props.initialState, authPlugins: props.authPlugins },
        React.createElement(react_redux_1.ReactReduxContext.Consumer, null, function (_a) {
            var store = _a.store;
            return React.createElement(Root_1.default, __assign({ store: store }, props));
        })));
};
exports.default = OPDSCatalog;
