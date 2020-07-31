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
var PropTypes = require("prop-types");
/**
 * This component will pass the router down the tree
 * via both old and new context apis. Currently, OPDS web
 * gets this context from react-router's Router, but that
 * context goes away in RR v4+. This makes it possible for
 * circulation-patron-web to use RR v4+ while maintaining
 * compatibility with current opds-web.
 */
exports.RouterContext = React.createContext(undefined);
var RouterProvider = /** @class */ (function (_super) {
    __extends(RouterProvider, _super);
    function RouterProvider() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RouterProvider.prototype.getChildContext = function () {
        return {
            router: this.props.router
        };
    };
    RouterProvider.prototype.render = function () {
        return (React.createElement(exports.RouterContext.Provider, { value: this.props.router }, this.props.children));
    };
    RouterProvider.childContextTypes = {
        router: PropTypes.object.isRequired
    };
    return RouterProvider;
}(React.Component));
exports.default = RouterProvider;
