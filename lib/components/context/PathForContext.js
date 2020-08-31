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
 * This is a component that will pass the pathFor prop down the tree
 * via both old and new context apis.
 */
exports.PathForContext = React.createContext(undefined);
var PathForProvider = /** @class */ (function (_super) {
    __extends(PathForProvider, _super);
    function PathForProvider() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PathForProvider.prototype.getChildContext = function () {
        return {
            pathFor: this.props.pathFor
        };
    };
    PathForProvider.prototype.render = function () {
        return (React.createElement(exports.PathForContext.Provider, { value: this.props.pathFor }, this.props.children));
    };
    PathForProvider.childContextTypes = {
        pathFor: PropTypes.func.isRequired
    };
    return PathForProvider;
}(React.Component));
exports.default = PathForProvider;
function usePathFor() {
    var context = React.useContext(exports.PathForContext);
    if (typeof context === "undefined") {
        throw new Error("usePathFor must be used within a PathForProvider");
    }
    return context;
}
exports.usePathFor = usePathFor;
