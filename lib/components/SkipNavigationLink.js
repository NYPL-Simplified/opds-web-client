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
/** Link to skip to main content for a11y. */
var SkipNavigationLink = /** @class */ (function (_super) {
    __extends(SkipNavigationLink, _super);
    function SkipNavigationLink() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SkipNavigationLink.prototype.render = function () {
        var tabIndex = -1;
        var label = "Skip " + (this.props.label || "navigation");
        return (React.createElement("div", { className: "skip-navigation", tabIndex: tabIndex },
            React.createElement("a", { href: this.props.target }, label)));
    };
    return SkipNavigationLink;
}(React.Component));
exports.default = SkipNavigationLink;
